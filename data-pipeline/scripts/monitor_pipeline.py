#!/usr/bin/env python3
"""
Pipeline monitoring and dashboard script
"""
import os
import sys
import json
import time
from datetime import datetime, timedelta
from pathlib import Path
import argparse

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from pipeline_manager import PipelineManager
from utils.logger import get_logger

logger = get_logger("monitor")

class PipelineMonitor:
    """Monitor pipeline status and health"""
    
    def __init__(self):
        self.manager = PipelineManager()
    
    def show_dashboard(self, refresh_interval: int = 30):
        """Show real-time pipeline dashboard"""
        try:
            while True:
                # Clear screen
                os.system('clear' if os.name == 'posix' else 'cls')
                
                # Header
                print("=" * 80)
                print("🔍 BiteBase Data Pipeline Monitor")
                print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                print("=" * 80)
                
                # Get status
                status = self.manager.get_pipeline_status()
                
                if 'error' in status:
                    print(f"❌ Error getting status: {status['error']}")
                else:
                    self._display_status(status)
                
                print("\n" + "=" * 80)
                print(f"🔄 Refreshing every {refresh_interval} seconds (Press Ctrl+C to exit)")
                
                time.sleep(refresh_interval)
                
        except KeyboardInterrupt:
            print("\n👋 Monitor stopped")
    
    def _display_status(self, status: dict):
        """Display pipeline status"""
        
        # Database Status
        print("\n📊 Database Status:")
        db_status = status.get('database_status', {})
        print(f"  🏪 Restaurants: {db_status.get('restaurants', 0):,}")
        print(f"  🍽️  Menu Items: {db_status.get('menu_items', 0):,}")
        
        # Data Lake Status
        print("\n💾 Data Lake Status:")
        dl_status = status.get('data_lake_files', {})
        print(f"  📥 Raw Restaurants: {dl_status.get('raw_restaurants', 0)}")
        print(f"  📥 Raw Menus: {dl_status.get('raw_menus', 0)}")
        print(f"  🔄 Processed Restaurants: {dl_status.get('processed_restaurants', 0)}")
        print(f"  🔄 Processed Menus: {dl_status.get('processed_menus', 0)}")
        print(f"  ✨ Curated Restaurants: {dl_status.get('curated_restaurants', 0)}")
        print(f"  ✨ Curated Menus: {dl_status.get('curated_menus', 0)}")
        
        # Recent ETL Jobs
        print("\n🔧 Recent ETL Jobs:")
        recent_jobs = status.get('recent_etl_jobs', [])
        if recent_jobs:
            for job in recent_jobs[:5]:
                status_icon = "✅" if job.get('status') == 'success' else "❌"
                job_type = job.get('job_type', 'unknown')
                records = job.get('records_processed', 0)
                duration = job.get('duration_seconds', 0)
                created_at = job.get('created_at', '')
                
                if isinstance(created_at, str):
                    try:
                        created_dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        time_str = created_dt.strftime('%H:%M:%S')
                    except:
                        time_str = created_at
                else:
                    time_str = str(created_at)
                
                print(f"  {status_icon} {job_type}: {records:,} records in {duration:.1f}s ({time_str})")
        else:
            print("  No recent jobs found")
        
        # Scheduler Status
        print("\n⏰ Scheduler Status:")
        scheduler_status = status.get('scheduler_status', {})
        if scheduler_status:
            running_jobs = scheduler_status.get('running_jobs', 0)
            recent_jobs = scheduler_status.get('recent_jobs', 0)
            print(f"  🏃 Running Jobs: {running_jobs}")
            print(f"  📈 Recent Jobs (24h): {recent_jobs}")
        else:
            print("  Scheduler not running")
    
    def show_summary(self):
        """Show pipeline summary"""
        print("📋 Pipeline Summary")
        print("=" * 50)
        
        status = self.manager.get_pipeline_status()
        
        if 'error' in status:
            print(f"❌ Error: {status['error']}")
            return
        
        # Overall health
        db_status = status.get('database_status', {})
        total_restaurants = db_status.get('restaurants', 0)
        total_menus = db_status.get('menu_items', 0)
        
        if total_restaurants > 0 and total_menus > 0:
            health = "🟢 Healthy"
        elif total_restaurants > 0:
            health = "🟡 Partial Data"
        else:
            health = "🔴 No Data"
        
        print(f"Health Status: {health}")
        print(f"Total Restaurants: {total_restaurants:,}")
        print(f"Total Menu Items: {total_menus:,}")
        
        # Data freshness
        recent_jobs = status.get('recent_etl_jobs', [])
        if recent_jobs:
            latest_job = recent_jobs[0]
            created_at = latest_job.get('created_at', '')
            if created_at:
                try:
                    if isinstance(created_at, str):
                        created_dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    else:
                        created_dt = created_at
                    
                    age = datetime.now() - created_dt.replace(tzinfo=None)
                    
                    if age.days == 0:
                        freshness = f"🟢 Fresh ({age.seconds // 3600}h ago)"
                    elif age.days <= 1:
                        freshness = f"🟡 Recent ({age.days}d ago)"
                    else:
                        freshness = f"🔴 Stale ({age.days}d ago)"
                    
                    print(f"Data Freshness: {freshness}")
                except:
                    print("Data Freshness: Unknown")
        
        # Recent activity
        print(f"\nRecent ETL Jobs: {len(recent_jobs)}")
        for job in recent_jobs[:3]:
            status_icon = "✅" if job.get('status') == 'success' else "❌"
            job_type = job.get('job_type', 'unknown')
            records = job.get('records_processed', 0)
            print(f"  {status_icon} {job_type}: {records:,} records")
    
    def check_health(self):
        """Check pipeline health and return exit code"""
        status = self.manager.get_pipeline_status()
        
        if 'error' in status:
            print(f"❌ Pipeline Error: {status['error']}")
            return 1
        
        # Check database
        db_status = status.get('database_status', {})
        restaurants = db_status.get('restaurants', 0)
        menus = db_status.get('menu_items', 0)
        
        issues = []
        
        if restaurants == 0:
            issues.append("No restaurant data in database")
        
        if menus == 0:
            issues.append("No menu data in database")
        
        # Check recent jobs
        recent_jobs = status.get('recent_etl_jobs', [])
        if recent_jobs:
            latest_job = recent_jobs[0]
            if latest_job.get('status') != 'success':
                issues.append(f"Latest ETL job failed: {latest_job.get('job_type')}")
        else:
            issues.append("No recent ETL jobs found")
        
        if issues:
            print("❌ Health Check Failed:")
            for issue in issues:
                print(f"  - {issue}")
            return 1
        else:
            print("✅ Pipeline Health Check Passed")
            print(f"  - {restaurants:,} restaurants in database")
            print(f"  - {menus:,} menu items in database")
            print(f"  - {len(recent_jobs)} recent ETL jobs")
            return 0
    
    def tail_logs(self, log_type: str = "pipeline", lines: int = 50):
        """Tail pipeline logs"""
        log_files = {
            "pipeline": "data_pipeline.log",
            "scraper": "wongnai_scraper.log", 
            "processor": "data_processor.log",
            "scheduler": "scheduler.log"
        }
        
        if log_type not in log_files:
            print(f"❌ Unknown log type: {log_type}")
            print(f"Available types: {', '.join(log_files.keys())}")
            return
        
        log_file = Path(__file__).parent.parent / "logs" / log_files[log_type]
        
        if not log_file.exists():
            print(f"❌ Log file not found: {log_file}")
            return
        
        print(f"📄 Tailing {log_type} logs ({lines} lines):")
        print("=" * 60)
        
        try:
            with open(log_file, 'r') as f:
                lines_list = f.readlines()
                for line in lines_list[-lines:]:
                    print(line.rstrip())
        except Exception as e:
            print(f"❌ Error reading log file: {e}")

def main():
    parser = argparse.ArgumentParser(description="Pipeline Monitor")
    parser.add_argument("--action", choices=[
        'dashboard', 'summary', 'health', 'logs'
    ], default='summary', help="Action to perform")
    
    parser.add_argument("--refresh", type=int, default=30,
                       help="Dashboard refresh interval (seconds)")
    parser.add_argument("--log-type", choices=[
        'pipeline', 'scraper', 'processor', 'scheduler'
    ], default='pipeline', help="Log type to tail")
    parser.add_argument("--lines", type=int, default=50,
                       help="Number of log lines to show")
    
    args = parser.parse_args()
    
    monitor = PipelineMonitor()
    
    if args.action == 'dashboard':
        monitor.show_dashboard(args.refresh)
    elif args.action == 'summary':
        monitor.show_summary()
    elif args.action == 'health':
        exit_code = monitor.check_health()
        sys.exit(exit_code)
    elif args.action == 'logs':
        monitor.tail_logs(args.log_type, args.lines)

if __name__ == "__main__":
    main()