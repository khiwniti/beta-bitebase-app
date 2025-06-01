"""
Cron job scheduler for data pipeline tasks
"""
import os
import sys
import time
import signal
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass, asdict
from pathlib import Path
import schedule
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

from config.settings import settings
from utils.logger import get_logger
from utils.datalake import datalake

logger = get_logger("scheduler")

@dataclass
class JobResult:
    """Result of a scheduled job execution"""
    job_name: str
    start_time: datetime
    end_time: Optional[datetime]
    status: str  # 'running', 'success', 'failed'
    output: str
    error: Optional[str]
    duration_seconds: Optional[float]

class JobMonitor:
    """Monitor and track job executions"""
    
    def __init__(self):
        self.job_history: List[JobResult] = []
        self.running_jobs: Dict[str, JobResult] = {}
        self.max_history = 1000
    
    def start_job(self, job_name: str) -> JobResult:
        """Start tracking a job"""
        result = JobResult(
            job_name=job_name,
            start_time=datetime.now(),
            end_time=None,
            status='running',
            output='',
            error=None,
            duration_seconds=None
        )
        
        self.running_jobs[job_name] = result
        logger.info(f"Started job: {job_name}")
        return result
    
    def complete_job(self, job_name: str, status: str, output: str = '', error: str = None):
        """Complete a job tracking"""
        if job_name in self.running_jobs:
            result = self.running_jobs[job_name]
            result.end_time = datetime.now()
            result.status = status
            result.output = output
            result.error = error
            result.duration_seconds = (result.end_time - result.start_time).total_seconds()
            
            # Move to history
            self.job_history.append(result)
            del self.running_jobs[job_name]
            
            # Limit history size
            if len(self.job_history) > self.max_history:
                self.job_history = self.job_history[-self.max_history:]
            
            logger.info(f"Completed job: {job_name} - Status: {status} - Duration: {result.duration_seconds:.2f}s")
    
    def get_job_status(self, job_name: str) -> Optional[JobResult]:
        """Get current status of a job"""
        if job_name in self.running_jobs:
            return self.running_jobs[job_name]
        
        # Get latest from history
        for result in reversed(self.job_history):
            if result.job_name == job_name:
                return result
        
        return None
    
    def get_recent_jobs(self, hours: int = 24) -> List[JobResult]:
        """Get jobs from recent hours"""
        cutoff = datetime.now() - timedelta(hours=hours)
        return [job for job in self.job_history if job.start_time >= cutoff]
    
    def save_history(self, file_path: str):
        """Save job history to file"""
        history_data = [asdict(job) for job in self.job_history]
        
        # Convert datetime objects to ISO strings
        for job_data in history_data:
            job_data['start_time'] = job_data['start_time'].isoformat()
            if job_data['end_time']:
                job_data['end_time'] = job_data['end_time'].isoformat()
        
        with open(file_path, 'w') as f:
            json.dump(history_data, f, indent=2)

class DataPipelineScheduler:
    """Main scheduler for data pipeline jobs"""
    
    def __init__(self):
        self.config = settings.cron
        self.monitor = JobMonitor()
        self.executor = ThreadPoolExecutor(max_workers=4)
        self.running = False
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
        # Job definitions
        self.jobs = {
            'scrape_restaurants': {
                'function': self._run_restaurant_scraping,
                'schedule': self.config.restaurant_scraping_schedule,
                'description': 'Scrape restaurant data from Wongnai'
            },
            'scrape_menus': {
                'function': self._run_menu_scraping,
                'schedule': self.config.menu_scraping_schedule,
                'description': 'Scrape menu data from Wongnai'
            },
            'process_data': {
                'function': self._run_etl_processing,
                'schedule': self.config.etl_schedule,
                'description': 'Process raw data through ETL pipeline'
            },
            'cleanup_old_data': {
                'function': self._run_data_cleanup,
                'schedule': '0 1 * * 0',  # Weekly on Sunday at 1 AM
                'description': 'Clean up old data files'
            },
            'health_check': {
                'function': self._run_health_check,
                'schedule': '*/15 * * * *',  # Every 15 minutes
                'description': 'Check system health'
            }
        }
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"Received signal {signum}, shutting down gracefully...")
        self.stop()
    
    def setup_schedules(self):
        """Setup all scheduled jobs"""
        logger.info("Setting up job schedules")
        
        for job_name, job_config in self.jobs.items():
            try:
                # Parse cron schedule and convert to schedule library format
                cron_schedule = job_config['schedule']
                
                if self._is_cron_format(cron_schedule):
                    # Convert cron to schedule calls
                    self._schedule_cron_job(job_name, job_config, cron_schedule)
                else:
                    logger.warning(f"Invalid cron format for job {job_name}: {cron_schedule}")
                
            except Exception as e:
                logger.error(f"Error setting up schedule for {job_name}: {str(e)}")
        
        logger.info(f"Scheduled {len(self.jobs)} jobs")
    
    def _is_cron_format(self, cron_str: str) -> bool:
        """Check if string is valid cron format"""
        parts = cron_str.split()
        return len(parts) == 5
    
    def _schedule_cron_job(self, job_name: str, job_config: Dict, cron_schedule: str):
        """Convert cron schedule to schedule library calls"""
        parts = cron_schedule.split()
        minute, hour, day, month, weekday = parts
        
        # Create a wrapper function for the job
        def job_wrapper():
            self._execute_job(job_name, job_config['function'])
        
        # Handle different schedule patterns
        if minute == '*' and hour == '*':
            # Every minute (for testing)
            schedule.every().minute.do(job_wrapper)
        elif hour == '*':
            # Every hour at specific minute
            if minute.startswith('*/'):
                interval = int(minute[2:])
                schedule.every(interval).minutes.do(job_wrapper)
            else:
                schedule.every().hour.at(f":{minute}").do(job_wrapper)
        elif day == '*' and month == '*' and weekday == '*':
            # Daily at specific time
            time_str = f"{hour.zfill(2)}:{minute.zfill(2)}"
            schedule.every().day.at(time_str).do(job_wrapper)
        elif weekday != '*':
            # Weekly on specific day
            time_str = f"{hour.zfill(2)}:{minute.zfill(2)}"
            weekday_map = {
                '0': 'sunday', '1': 'monday', '2': 'tuesday', '3': 'wednesday',
                '4': 'thursday', '5': 'friday', '6': 'saturday'
            }
            if weekday in weekday_map:
                getattr(schedule.every(), weekday_map[weekday]).at(time_str).do(job_wrapper)
        
        logger.info(f"Scheduled job '{job_name}': {cron_schedule}")
    
    def _execute_job(self, job_name: str, job_function: Callable):
        """Execute a job with monitoring"""
        try:
            # Start monitoring
            result = self.monitor.start_job(job_name)
            
            # Execute job in thread pool
            future = self.executor.submit(job_function)
            
            # Wait for completion with timeout
            try:
                output = future.result(timeout=3600)  # 1 hour timeout
                self.monitor.complete_job(job_name, 'success', str(output))
                
            except Exception as e:
                error_msg = str(e)
                logger.error(f"Job {job_name} failed: {error_msg}")
                self.monitor.complete_job(job_name, 'failed', '', error_msg)
                
                # Send alert if configured
                if self.config.enable_monitoring:
                    self._send_alert(job_name, error_msg)
        
        except Exception as e:
            logger.error(f"Error executing job {job_name}: {str(e)}")
    
    def _run_restaurant_scraping(self) -> str:
        """Run restaurant scraping job"""
        logger.info("Starting restaurant scraping job")
        
        try:
            # Import here to avoid circular imports
            from scrapers.wongnai_scraper import WongnaiScraper
            
            scraper = WongnaiScraper()
            
            # Scrape restaurants for major regions
            regions = ['bangkok', 'chiang_mai', 'phuket']
            categories = ['restaurant', 'cafe']
            
            results = scraper.run_full_scrape(
                regions=regions,
                categories=categories,
                max_pages_per_category=3,
                scrape_details=True,
                scrape_menus=False  # Separate job for menus
            )
            
            summary = results['summary']
            return f"Scraped {summary['total_restaurants']} restaurants from {summary['regions_scraped']} regions"
            
        except Exception as e:
            logger.error(f"Restaurant scraping failed: {str(e)}")
            raise
    
    def _run_menu_scraping(self) -> str:
        """Run menu scraping job"""
        logger.info("Starting menu scraping job")
        
        try:
            from scrapers.wongnai_scraper import WongnaiScraper
            
            # Get recent restaurant data to scrape menus
            recent_files = datalake.list_files("raw/wongnai/restaurants")
            
            if not recent_files:
                return "No restaurant data found for menu scraping"
            
            # Load most recent restaurant data
            latest_file = sorted(recent_files)[-1]
            restaurant_data = datalake.load_data(latest_file)
            
            if isinstance(restaurant_data, dict) and 'data' in restaurant_data:
                restaurants = restaurant_data['data']
            else:
                restaurants = restaurant_data
            
            scraper = WongnaiScraper()
            all_menus = []
            
            # Scrape menus for a subset of restaurants (to avoid overload)
            sample_size = min(50, len(restaurants))
            sample_restaurants = restaurants[:sample_size]
            
            for restaurant in sample_restaurants:
                if 'wongnai_url' in restaurant:
                    menus = scraper.scrape_menu(restaurant['wongnai_url'])
                    all_menus.extend(menus)
            
            # Save menu data
            if all_menus:
                datalake.save_raw_data(all_menus, 'wongnai', 'menus')
            
            return f"Scraped {len(all_menus)} menu items from {sample_size} restaurants"
            
        except Exception as e:
            logger.error(f"Menu scraping failed: {str(e)}")
            raise
    
    def _run_etl_processing(self) -> str:
        """Run ETL processing job"""
        logger.info("Starting ETL processing job")
        
        try:
            from etl.data_processor import DataProcessor
            
            processor = DataProcessor()
            
            # Get recent raw data files
            restaurant_files = datalake.list_files("raw/wongnai/restaurants")
            menu_files = datalake.list_files("raw/wongnai/menus")
            
            processed_count = 0
            
            # Process restaurant data
            if restaurant_files:
                latest_restaurant_file = sorted(restaurant_files)[-1]
                df_restaurants, quality_report = processor.process_restaurant_data(latest_restaurant_file)
                
                # Save curated data
                datalake.save_curated_data(df_restaurants, 'restaurants', 'latest')
                processed_count += len(df_restaurants)
                
                logger.info(f"Processed {len(df_restaurants)} restaurants (quality: {quality_report.quality_score:.2f})")
            
            # Process menu data
            if menu_files:
                latest_menu_file = sorted(menu_files)[-1]
                df_menus, quality_report = processor.process_menu_data(latest_menu_file)
                
                # Save curated data
                datalake.save_curated_data(df_menus, 'menus', 'latest')
                processed_count += len(df_menus)
                
                logger.info(f"Processed {len(df_menus)} menu items (quality: {quality_report.quality_score:.2f})")
            
            return f"Processed {processed_count} total records"
            
        except Exception as e:
            logger.error(f"ETL processing failed: {str(e)}")
            raise
    
    def _run_data_cleanup(self) -> str:
        """Run data cleanup job"""
        logger.info("Starting data cleanup job")
        
        try:
            # Clean up files older than 30 days
            cutoff_date = datetime.now() - timedelta(days=30)
            
            all_files = datalake.list_files()
            old_files = []
            
            for file_path in all_files:
                # Extract date from file path
                if '/raw/' in file_path:
                    # Check if file is old based on path structure
                    parts = file_path.split('/')
                    if len(parts) >= 6:  # raw/source/type/YYYY/MM/DD/file
                        try:
                            year = int(parts[3])
                            month = int(parts[4])
                            day = int(parts[5])
                            file_date = datetime(year, month, day)
                            
                            if file_date < cutoff_date:
                                old_files.append(file_path)
                        except (ValueError, IndexError):
                            continue
            
            # Archive old files (move to archive directory)
            archived_count = 0
            for old_file in old_files:
                try:
                    # Load and move to archive
                    data = datalake.load_data(old_file)
                    archive_path = old_file.replace('/raw/', '/archive/')
                    
                    # Save to archive (implementation depends on storage backend)
                    # For now, just log the action
                    logger.info(f"Would archive: {old_file}")
                    archived_count += 1
                    
                except Exception as e:
                    logger.error(f"Error archiving {old_file}: {str(e)}")
            
            return f"Archived {archived_count} old files"
            
        except Exception as e:
            logger.error(f"Data cleanup failed: {str(e)}")
            raise
    
    def _run_health_check(self) -> str:
        """Run system health check"""
        try:
            health_status = {
                'timestamp': datetime.now().isoformat(),
                'datalake_accessible': True,
                'recent_jobs': len(self.monitor.get_recent_jobs(1)),
                'running_jobs': len(self.monitor.running_jobs),
                'disk_usage': self._check_disk_usage(),
                'memory_usage': self._check_memory_usage()
            }
            
            # Check if data lake is accessible
            try:
                datalake.list_files()
            except Exception:
                health_status['datalake_accessible'] = False
            
            # Save health status
            health_file = settings.logs_dir / f"health_check_{datetime.now().strftime('%Y%m%d')}.json"
            with open(health_file, 'w') as f:
                json.dump(health_status, f, indent=2)
            
            return f"Health check completed - Status: {'OK' if health_status['datalake_accessible'] else 'WARNING'}"
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            raise
    
    def _check_disk_usage(self) -> Dict:
        """Check disk usage"""
        try:
            import shutil
            total, used, free = shutil.disk_usage(settings.data_dir)
            
            return {
                'total_gb': round(total / (1024**3), 2),
                'used_gb': round(used / (1024**3), 2),
                'free_gb': round(free / (1024**3), 2),
                'usage_percent': round((used / total) * 100, 2)
            }
        except Exception:
            return {'error': 'Unable to check disk usage'}
    
    def _check_memory_usage(self) -> Dict:
        """Check memory usage"""
        try:
            import psutil
            memory = psutil.virtual_memory()
            
            return {
                'total_gb': round(memory.total / (1024**3), 2),
                'used_gb': round(memory.used / (1024**3), 2),
                'available_gb': round(memory.available / (1024**3), 2),
                'usage_percent': memory.percent
            }
        except ImportError:
            return {'error': 'psutil not available'}
        except Exception:
            return {'error': 'Unable to check memory usage'}
    
    def _send_alert(self, job_name: str, error_message: str):
        """Send alert for job failure"""
        if self.config.alert_email:
            # Implementation would depend on email service
            logger.warning(f"ALERT: Job {job_name} failed - {error_message}")
            # TODO: Implement email alerting
    
    def start(self):
        """Start the scheduler"""
        logger.info("Starting data pipeline scheduler")
        
        self.setup_schedules()
        self.running = True
        
        logger.info("Scheduler started. Press Ctrl+C to stop.")
        
        try:
            while self.running:
                schedule.run_pending()
                time.sleep(1)
                
        except KeyboardInterrupt:
            logger.info("Received keyboard interrupt")
        finally:
            self.stop()
    
    def stop(self):
        """Stop the scheduler"""
        logger.info("Stopping scheduler...")
        
        self.running = False
        
        # Wait for running jobs to complete
        if self.monitor.running_jobs:
            logger.info(f"Waiting for {len(self.monitor.running_jobs)} running jobs to complete...")
            
            # Give jobs time to complete gracefully
            for i in range(30):  # Wait up to 30 seconds
                if not self.monitor.running_jobs:
                    break
                time.sleep(1)
        
        # Shutdown executor
        self.executor.shutdown(wait=True)
        
        # Save job history
        history_file = settings.logs_dir / f"job_history_{datetime.now().strftime('%Y%m%d')}.json"
        self.monitor.save_history(str(history_file))
        
        logger.info("Scheduler stopped")
    
    def run_job_now(self, job_name: str) -> bool:
        """Run a specific job immediately"""
        if job_name not in self.jobs:
            logger.error(f"Unknown job: {job_name}")
            return False
        
        logger.info(f"Running job immediately: {job_name}")
        
        job_config = self.jobs[job_name]
        self._execute_job(job_name, job_config['function'])
        
        return True
    
    def get_job_status(self, job_name: str = None) -> Dict:
        """Get status of jobs"""
        if job_name:
            status = self.monitor.get_job_status(job_name)
            return asdict(status) if status else None
        else:
            return {
                'running_jobs': len(self.monitor.running_jobs),
                'recent_jobs': len(self.monitor.get_recent_jobs(24)),
                'total_jobs_in_history': len(self.monitor.job_history)
            }

# CLI interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Data Pipeline Scheduler")
    parser.add_argument("--action", choices=['start', 'run-job', 'status'], 
                       default='start', help="Action to perform")
    parser.add_argument("--job", help="Job name to run (for run-job action)")
    parser.add_argument("--daemon", action="store_true", 
                       help="Run as daemon process")
    
    args = parser.parse_args()
    
    scheduler = DataPipelineScheduler()
    
    if args.action == 'start':
        if args.daemon:
            # TODO: Implement daemon mode
            logger.info("Daemon mode not implemented yet")
        else:
            scheduler.start()
    
    elif args.action == 'run-job':
        if not args.job:
            print("Job name required for run-job action")
            sys.exit(1)
        
        success = scheduler.run_job_now(args.job)
        if not success:
            sys.exit(1)
    
    elif args.action == 'status':
        status = scheduler.get_job_status()
        print(json.dumps(status, indent=2))