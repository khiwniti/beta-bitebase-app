"""
Main pipeline manager for orchestrating the entire data pipeline
"""
import sys
import json
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path

from config.settings import settings
from utils.logger import get_logger
from utils.datalake import datalake
from scrapers.wongnai_scraper import WongnaiScraper
from etl.data_processor import DataProcessor
from etl.database_loader import DatabaseLoader
from cron.scheduler import DataPipelineScheduler

logger = get_logger("pipeline_manager")

class PipelineManager:
    """Main pipeline manager"""
    
    def __init__(self):
        self.scraper = WongnaiScraper()
        self.processor = DataProcessor()
        self.loader = DatabaseLoader()
        self.scheduler = DataPipelineScheduler()
        
    def run_full_pipeline(self, regions: List[str] = None, 
                         categories: List[str] = None,
                         max_pages: int = 3) -> Dict:
        """
        Run the complete data pipeline from scraping to database loading
        
        Args:
            regions: List of regions to scrape
            categories: List of categories to scrape
            max_pages: Maximum pages per category
            
        Returns:
            Pipeline execution summary
        """
        logger.info("Starting full data pipeline execution")
        
        pipeline_start = datetime.now()
        results = {
            'pipeline_id': f"pipeline_{pipeline_start.strftime('%Y%m%d_%H%M%S')}",
            'start_time': pipeline_start.isoformat(),
            'stages': {},
            'summary': {}
        }
        
        try:
            # Stage 1: Data Scraping
            logger.info("Stage 1: Data Scraping")
            scraping_results = self._run_scraping_stage(regions, categories, max_pages)
            results['stages']['scraping'] = scraping_results
            
            # Stage 2: Data Processing (ETL)
            logger.info("Stage 2: Data Processing")
            processing_results = self._run_processing_stage(scraping_results)
            results['stages']['processing'] = processing_results
            
            # Stage 3: Database Loading
            logger.info("Stage 3: Database Loading")
            loading_results = self._run_loading_stage(processing_results)
            results['stages']['loading'] = loading_results
            
            # Stage 4: Data Validation
            logger.info("Stage 4: Data Validation")
            validation_results = self._run_validation_stage()
            results['stages']['validation'] = validation_results
            
            # Calculate summary
            pipeline_end = datetime.now()
            results['end_time'] = pipeline_end.isoformat()
            results['duration_minutes'] = (pipeline_end - pipeline_start).total_seconds() / 60
            results['status'] = 'success'
            
            # Generate summary
            results['summary'] = self._generate_pipeline_summary(results)
            
            # Save pipeline results
            self._save_pipeline_results(results)
            
            logger.info(f"Full pipeline completed successfully in {results['duration_minutes']:.2f} minutes")
            return results
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Pipeline failed: {error_msg}")
            
            results['end_time'] = datetime.now().isoformat()
            results['status'] = 'failed'
            results['error'] = error_msg
            
            self._save_pipeline_results(results)
            raise
    
    def _run_scraping_stage(self, regions: List[str], categories: List[str], max_pages: int) -> Dict:
        """Run data scraping stage"""
        stage_start = datetime.now()
        
        try:
            # Set defaults if not provided
            if regions is None:
                regions = ['bangkok', 'chiang_mai']
            if categories is None:
                categories = ['restaurant', 'cafe']
            
            # Run scraping
            scraping_results = self.scraper.run_full_scrape(
                regions=regions,
                categories=categories,
                max_pages_per_category=max_pages,
                scrape_details=True,
                scrape_menus=True
            )
            
            stage_end = datetime.now()
            
            return {
                'status': 'success',
                'start_time': stage_start.isoformat(),
                'end_time': stage_end.isoformat(),
                'duration_minutes': (stage_end - stage_start).total_seconds() / 60,
                'restaurants_scraped': scraping_results['summary']['total_restaurants'],
                'menu_items_scraped': scraping_results['summary']['total_menu_items'],
                'regions_processed': len(regions),
                'categories_processed': len(categories)
            }
            
        except Exception as e:
            logger.error(f"Scraping stage failed: {str(e)}")
            return {
                'status': 'failed',
                'error': str(e),
                'start_time': stage_start.isoformat(),
                'end_time': datetime.now().isoformat()
            }
    
    def _run_processing_stage(self, scraping_results: Dict) -> Dict:
        """Run data processing (ETL) stage"""
        stage_start = datetime.now()
        
        try:
            processing_results = {
                'status': 'success',
                'start_time': stage_start.isoformat(),
                'restaurants_processed': 0,
                'menu_items_processed': 0,
                'quality_reports': []
            }
            
            # Get latest raw data files
            restaurant_files = datalake.list_files("raw/wongnai/restaurants")
            menu_files = datalake.list_files("raw/wongnai/menus")
            
            # Process restaurant data
            if restaurant_files:
                latest_restaurant_file = sorted(restaurant_files)[-1]
                logger.info(f"Processing restaurant file: {latest_restaurant_file}")
                
                df_restaurants, quality_report = self.processor.process_restaurant_data(latest_restaurant_file)
                
                # Save curated data
                curated_path = datalake.save_curated_data(df_restaurants, 'restaurants', 'latest')
                
                processing_results['restaurants_processed'] = len(df_restaurants)
                processing_results['restaurant_quality_score'] = quality_report.quality_score
                processing_results['restaurant_curated_path'] = curated_path
                processing_results['quality_reports'].append({
                    'type': 'restaurants',
                    'quality_score': quality_report.quality_score,
                    'total_records': quality_report.total_records,
                    'valid_records': quality_report.valid_records
                })
            
            # Process menu data
            if menu_files:
                latest_menu_file = sorted(menu_files)[-1]
                logger.info(f"Processing menu file: {latest_menu_file}")
                
                df_menus, quality_report = self.processor.process_menu_data(latest_menu_file)
                
                # Save curated data
                curated_path = datalake.save_curated_data(df_menus, 'menus', 'latest')
                
                processing_results['menu_items_processed'] = len(df_menus)
                processing_results['menu_quality_score'] = quality_report.quality_score
                processing_results['menu_curated_path'] = curated_path
                processing_results['quality_reports'].append({
                    'type': 'menus',
                    'quality_score': quality_report.quality_score,
                    'total_records': quality_report.total_records,
                    'valid_records': quality_report.valid_records
                })
            
            stage_end = datetime.now()
            processing_results['end_time'] = stage_end.isoformat()
            processing_results['duration_minutes'] = (stage_end - stage_start).total_seconds() / 60
            
            return processing_results
            
        except Exception as e:
            logger.error(f"Processing stage failed: {str(e)}")
            return {
                'status': 'failed',
                'error': str(e),
                'start_time': stage_start.isoformat(),
                'end_time': datetime.now().isoformat()
            }
    
    def _run_loading_stage(self, processing_results: Dict) -> Dict:
        """Run database loading stage"""
        stage_start = datetime.now()
        
        try:
            # Ensure database tables exist
            self.loader.create_tables()
            
            loading_results = {
                'status': 'success',
                'start_time': stage_start.isoformat(),
                'restaurants_loaded': 0,
                'menu_items_loaded': 0,
                'load_stats': {}
            }
            
            # Load restaurant data
            if 'restaurant_curated_path' in processing_results:
                restaurant_stats = self.loader.load_restaurants(processing_results['restaurant_curated_path'])
                loading_results['restaurants_loaded'] = restaurant_stats['inserted'] + restaurant_stats['updated']
                loading_results['load_stats']['restaurants'] = restaurant_stats
            
            # Load menu data
            if 'menu_curated_path' in processing_results:
                menu_stats = self.loader.load_menu_items(processing_results['menu_curated_path'])
                loading_results['menu_items_loaded'] = menu_stats['inserted'] + menu_stats['updated']
                loading_results['load_stats']['menus'] = menu_stats
            
            stage_end = datetime.now()
            loading_results['end_time'] = stage_end.isoformat()
            loading_results['duration_minutes'] = (stage_end - stage_start).total_seconds() / 60
            
            return loading_results
            
        except Exception as e:
            logger.error(f"Loading stage failed: {str(e)}")
            return {
                'status': 'failed',
                'error': str(e),
                'start_time': stage_start.isoformat(),
                'end_time': datetime.now().isoformat()
            }
    
    def _run_validation_stage(self) -> Dict:
        """Run data validation stage"""
        stage_start = datetime.now()
        
        try:
            validation_results = {
                'status': 'success',
                'start_time': stage_start.isoformat(),
                'database_counts': {},
                'data_quality_checks': []
            }
            
            # Get database counts
            restaurant_count = self.loader.get_restaurant_count()
            menu_count = self.loader.get_menu_item_count()
            
            validation_results['database_counts'] = {
                'restaurants': restaurant_count,
                'menu_items': menu_count
            }
            
            # Basic data quality checks
            if restaurant_count > 0:
                validation_results['data_quality_checks'].append({
                    'check': 'restaurant_data_exists',
                    'status': 'pass',
                    'count': restaurant_count
                })
            else:
                validation_results['data_quality_checks'].append({
                    'check': 'restaurant_data_exists',
                    'status': 'fail',
                    'count': 0
                })
            
            if menu_count > 0:
                validation_results['data_quality_checks'].append({
                    'check': 'menu_data_exists',
                    'status': 'pass',
                    'count': menu_count
                })
            else:
                validation_results['data_quality_checks'].append({
                    'check': 'menu_data_exists',
                    'status': 'fail',
                    'count': 0
                })
            
            stage_end = datetime.now()
            validation_results['end_time'] = stage_end.isoformat()
            validation_results['duration_minutes'] = (stage_end - stage_start).total_seconds() / 60
            
            return validation_results
            
        except Exception as e:
            logger.error(f"Validation stage failed: {str(e)}")
            return {
                'status': 'failed',
                'error': str(e),
                'start_time': stage_start.isoformat(),
                'end_time': datetime.now().isoformat()
            }
    
    def _generate_pipeline_summary(self, results: Dict) -> Dict:
        """Generate pipeline execution summary"""
        summary = {
            'total_duration_minutes': results.get('duration_minutes', 0),
            'stages_completed': len([s for s in results['stages'].values() if s.get('status') == 'success']),
            'total_stages': len(results['stages']),
            'success_rate': 0
        }
        
        # Calculate success rate
        if summary['total_stages'] > 0:
            summary['success_rate'] = (summary['stages_completed'] / summary['total_stages']) * 100
        
        # Data summary
        scraping = results['stages'].get('scraping', {})
        processing = results['stages'].get('processing', {})
        loading = results['stages'].get('loading', {})
        validation = results['stages'].get('validation', {})
        
        summary['data_summary'] = {
            'restaurants_scraped': scraping.get('restaurants_scraped', 0),
            'menu_items_scraped': scraping.get('menu_items_scraped', 0),
            'restaurants_processed': processing.get('restaurants_processed', 0),
            'menu_items_processed': processing.get('menu_items_processed', 0),
            'restaurants_loaded': loading.get('restaurants_loaded', 0),
            'menu_items_loaded': loading.get('menu_items_loaded', 0),
            'final_restaurant_count': validation.get('database_counts', {}).get('restaurants', 0),
            'final_menu_count': validation.get('database_counts', {}).get('menu_items', 0)
        }
        
        # Quality summary
        quality_reports = processing.get('quality_reports', [])
        if quality_reports:
            avg_quality = sum(r['quality_score'] for r in quality_reports) / len(quality_reports)
            summary['average_quality_score'] = avg_quality
        
        return summary
    
    def _save_pipeline_results(self, results: Dict):
        """Save pipeline execution results"""
        try:
            # Save to data lake
            timestamp = datetime.now()
            results_path = datalake.save_raw_data(
                results, 
                'pipeline', 
                'execution_results',
                timestamp
            )
            
            # Also save to logs directory
            log_file = settings.logs_dir / f"pipeline_results_{timestamp.strftime('%Y%m%d_%H%M%S')}.json"
            with open(log_file, 'w') as f:
                json.dump(results, f, indent=2, default=str)
            
            logger.info(f"Pipeline results saved to {results_path} and {log_file}")
            
        except Exception as e:
            logger.error(f"Error saving pipeline results: {str(e)}")
    
    def start_scheduler(self):
        """Start the cron scheduler"""
        logger.info("Starting pipeline scheduler")
        self.scheduler.start()
    
    def run_scheduled_job(self, job_name: str) -> bool:
        """Run a specific scheduled job"""
        return self.scheduler.run_job_now(job_name)
    
    def get_pipeline_status(self) -> Dict:
        """Get current pipeline status"""
        try:
            status = {
                'timestamp': datetime.now().isoformat(),
                'database_status': {
                    'restaurants': self.loader.get_restaurant_count(),
                    'menu_items': self.loader.get_menu_item_count()
                },
                'recent_etl_jobs': self.loader.get_latest_etl_jobs(5),
                'scheduler_status': self.scheduler.get_job_status(),
                'data_lake_files': {
                    'raw_restaurants': len(datalake.list_files("raw/wongnai/restaurants")),
                    'raw_menus': len(datalake.list_files("raw/wongnai/menus")),
                    'processed_restaurants': len(datalake.list_files("processed/wongnai/restaurants")),
                    'processed_menus': len(datalake.list_files("processed/wongnai/menus")),
                    'curated_restaurants': len(datalake.list_files("curated/restaurants")),
                    'curated_menus': len(datalake.list_files("curated/menus"))
                }
            }
            
            return status
            
        except Exception as e:
            logger.error(f"Error getting pipeline status: {str(e)}")
            return {'error': str(e)}
    
    def cleanup_old_data(self, days: int = 30):
        """Clean up old data"""
        logger.info(f"Cleaning up data older than {days} days")
        
        try:
            # Clean up database
            self.loader.cleanup_old_data(days)
            
            # Clean up data lake files (implementation depends on storage backend)
            # For now, just log the action
            logger.info("Data lake cleanup completed")
            
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")
            raise

# CLI interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Data Pipeline Manager")
    parser.add_argument("--action", choices=[
        'run-full-pipeline', 'start-scheduler', 'run-job', 'status', 'cleanup'
    ], required=True)
    
    parser.add_argument("--regions", nargs="+", default=["bangkok"], 
                       help="Regions to scrape")
    parser.add_argument("--categories", nargs="+", default=["restaurant"],
                       help="Categories to scrape")
    parser.add_argument("--max-pages", type=int, default=3,
                       help="Maximum pages per category")
    parser.add_argument("--job", help="Job name to run")
    parser.add_argument("--cleanup-days", type=int, default=30,
                       help="Days for cleanup")
    
    args = parser.parse_args()
    
    manager = PipelineManager()
    
    if args.action == 'run-full-pipeline':
        try:
            results = manager.run_full_pipeline(
                regions=args.regions,
                categories=args.categories,
                max_pages=args.max_pages
            )
            
            print("Pipeline execution completed!")
            print(f"Status: {results['status']}")
            print(f"Duration: {results['duration_minutes']:.2f} minutes")
            print(f"Restaurants processed: {results['summary']['data_summary']['restaurants_loaded']}")
            print(f"Menu items processed: {results['summary']['data_summary']['menu_items_loaded']}")
            
        except Exception as e:
            print(f"Pipeline failed: {str(e)}")
            sys.exit(1)
    
    elif args.action == 'start-scheduler':
        manager.start_scheduler()
    
    elif args.action == 'run-job':
        if not args.job:
            print("Job name required")
            sys.exit(1)
        
        success = manager.run_scheduled_job(args.job)
        if success:
            print(f"Job '{args.job}' executed successfully")
        else:
            print(f"Job '{args.job}' failed")
            sys.exit(1)
    
    elif args.action == 'status':
        status = manager.get_pipeline_status()
        print(json.dumps(status, indent=2, default=str))
    
    elif args.action == 'cleanup':
        manager.cleanup_old_data(args.cleanup_days)
        print(f"Cleanup completed for data older than {args.cleanup_days} days")