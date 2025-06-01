"""
Database loader for processed data
"""
import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
import pandas as pd
from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String, Float, DateTime, Boolean, Text, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import uuid

from config.settings import settings
from utils.logger import get_logger
from utils.datalake import datalake

logger = get_logger("database_loader")

class DatabaseLoader:
    """Load processed data into the database"""
    
    def __init__(self):
        self.config = settings.database
        self.engine = create_engine(self.config.url)
        self.metadata = MetaData()
        self.Session = sessionmaker(bind=self.engine)
        
        # Define table schemas
        self._define_schemas()
    
    def _define_schemas(self):
        """Define database table schemas"""
        
        # Restaurants table
        self.restaurants_table = Table(
            'restaurants', self.metadata,
            Column('id', String(50), primary_key=True),
            Column('name', String(255), nullable=False),
            Column('address', Text),
            Column('latitude', Float),
            Column('longitude', Float),
            Column('phone', String(20)),
            Column('website', String(500)),
            Column('rating', Float),
            Column('review_count', Integer),
            Column('price_range', String(20)),
            Column('price_category', String(20)),
            Column('cuisine_type', String(100)),
            Column('region', String(50)),
            Column('rating_category', String(20)),
            Column('opening_hours', JSON),
            Column('features', JSON),
            Column('images', JSON),
            Column('description', Text),
            Column('wongnai_url', String(500)),
            Column('location_quality', String(20)),
            Column('data_completeness', Float),
            Column('is_active', Boolean, default=True),
            Column('scraped_at', DateTime),
            Column('processed_at', DateTime),
            Column('created_at', DateTime, default=datetime.utcnow),
            Column('updated_at', DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        )
        
        # Menu items table
        self.menu_items_table = Table(
            'menu_items', self.metadata,
            Column('id', String(50), primary_key=True),
            Column('restaurant_id', String(50), nullable=False),
            Column('item_name', String(255), nullable=False),
            Column('description', Text),
            Column('price', Float),
            Column('category', String(100)),
            Column('price_category', String(20)),
            Column('image_url', String(500)),
            Column('availability', Boolean, default=True),
            Column('ingredients', JSON),
            Column('allergens', JSON),
            Column('nutritional_info', JSON),
            Column('data_completeness', Float),
            Column('is_active', Boolean, default=True),
            Column('scraped_at', DateTime),
            Column('processed_at', DateTime),
            Column('created_at', DateTime, default=datetime.utcnow),
            Column('updated_at', DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        )
        
        # Data quality reports table
        self.data_quality_table = Table(
            'data_quality_reports', self.metadata,
            Column('id', String(50), primary_key=True),
            Column('data_type', String(50), nullable=False),
            Column('source_file', String(500)),
            Column('total_records', Integer),
            Column('valid_records', Integer),
            Column('invalid_records', Integer),
            Column('quality_score', Float),
            Column('issues', JSON),
            Column('null_percentages', JSON),
            Column('duplicate_count', Integer),
            Column('created_at', DateTime, default=datetime.utcnow)
        )
        
        # ETL job logs table
        self.etl_jobs_table = Table(
            'etl_jobs', self.metadata,
            Column('id', String(50), primary_key=True),
            Column('job_type', String(50), nullable=False),
            Column('source_file', String(500)),
            Column('target_table', String(100)),
            Column('records_processed', Integer),
            Column('records_inserted', Integer),
            Column('records_updated', Integer),
            Column('records_failed', Integer),
            Column('status', String(20)),
            Column('error_message', Text),
            Column('start_time', DateTime),
            Column('end_time', DateTime),
            Column('duration_seconds', Float),
            Column('created_at', DateTime, default=datetime.utcnow)
        )
    
    def create_tables(self):
        """Create database tables if they don't exist"""
        try:
            self.metadata.create_all(self.engine)
            logger.info("Database tables created successfully")
        except SQLAlchemyError as e:
            logger.error(f"Error creating tables: {str(e)}")
            raise
    
    def load_restaurants(self, data_path: str) -> Dict[str, int]:
        """
        Load restaurant data into database
        
        Args:
            data_path: Path to processed restaurant data
            
        Returns:
            Dictionary with load statistics
        """
        logger.info(f"Loading restaurant data from {data_path}")
        
        # Start ETL job tracking
        job_id = str(uuid.uuid4())
        start_time = datetime.utcnow()
        
        try:
            # Load processed data
            df = datalake.load_data(data_path, format="parquet")
            
            if df.empty:
                logger.warning("No restaurant data to load")
                return {'inserted': 0, 'updated': 0, 'failed': 0}
            
            # Prepare data for database
            df_db = self._prepare_restaurant_data(df)
            
            # Load data in batches
            stats = self._load_data_batch(df_db, 'restaurants', self.restaurants_table)
            
            # Log ETL job
            self._log_etl_job(
                job_id=job_id,
                job_type='load_restaurants',
                source_file=data_path,
                target_table='restaurants',
                records_processed=len(df),
                records_inserted=stats['inserted'],
                records_updated=stats['updated'],
                records_failed=stats['failed'],
                status='success',
                start_time=start_time,
                end_time=datetime.utcnow()
            )
            
            logger.info(f"Restaurant data loaded: {stats}")
            return stats
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Error loading restaurant data: {error_msg}")
            
            # Log failed job
            self._log_etl_job(
                job_id=job_id,
                job_type='load_restaurants',
                source_file=data_path,
                target_table='restaurants',
                records_processed=0,
                records_inserted=0,
                records_updated=0,
                records_failed=0,
                status='failed',
                error_message=error_msg,
                start_time=start_time,
                end_time=datetime.utcnow()
            )
            
            raise
    
    def load_menu_items(self, data_path: str) -> Dict[str, int]:
        """
        Load menu item data into database
        
        Args:
            data_path: Path to processed menu data
            
        Returns:
            Dictionary with load statistics
        """
        logger.info(f"Loading menu data from {data_path}")
        
        job_id = str(uuid.uuid4())
        start_time = datetime.utcnow()
        
        try:
            # Load processed data
            df = datalake.load_data(data_path, format="parquet")
            
            if df.empty:
                logger.warning("No menu data to load")
                return {'inserted': 0, 'updated': 0, 'failed': 0}
            
            # Prepare data for database
            df_db = self._prepare_menu_data(df)
            
            # Load data in batches
            stats = self._load_data_batch(df_db, 'menu_items', self.menu_items_table)
            
            # Log ETL job
            self._log_etl_job(
                job_id=job_id,
                job_type='load_menu_items',
                source_file=data_path,
                target_table='menu_items',
                records_processed=len(df),
                records_inserted=stats['inserted'],
                records_updated=stats['updated'],
                records_failed=stats['failed'],
                status='success',
                start_time=start_time,
                end_time=datetime.utcnow()
            )
            
            logger.info(f"Menu data loaded: {stats}")
            return stats
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Error loading menu data: {error_msg}")
            
            self._log_etl_job(
                job_id=job_id,
                job_type='load_menu_items',
                source_file=data_path,
                target_table='menu_items',
                records_processed=0,
                records_inserted=0,
                records_updated=0,
                records_failed=0,
                status='failed',
                error_message=error_msg,
                start_time=start_time,
                end_time=datetime.utcnow()
            )
            
            raise
    
    def _prepare_restaurant_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare restaurant data for database insertion"""
        df_db = df.copy()
        
        # Ensure required columns exist
        required_columns = ['restaurant_id', 'name']
        for col in required_columns:
            if col not in df_db.columns:
                raise ValueError(f"Required column missing: {col}")
        
        # Rename columns to match database schema
        column_mapping = {
            'restaurant_id': 'id',
            'opening_hours_parsed': 'opening_hours',
            'features_cleaned': 'features',
            'extracted_ingredients': 'ingredients'
        }
        
        for old_col, new_col in column_mapping.items():
            if old_col in df_db.columns:
                df_db = df_db.rename(columns={old_col: new_col})
        
        # Convert datetime columns
        datetime_columns = ['scraped_at', 'processed_at']
        for col in datetime_columns:
            if col in df_db.columns:
                df_db[col] = pd.to_datetime(df_db[col], errors='coerce')
        
        # Convert JSON columns
        json_columns = ['opening_hours', 'features', 'images']
        for col in json_columns:
            if col in df_db.columns:
                df_db[col] = df_db[col].apply(self._safe_json_convert)
        
        # Handle boolean columns
        df_db['is_active'] = True
        
        # Select only columns that exist in the database schema
        db_columns = [col.name for col in self.restaurants_table.columns]
        available_columns = [col for col in db_columns if col in df_db.columns]
        df_db = df_db[available_columns]
        
        return df_db
    
    def _prepare_menu_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare menu data for database insertion"""
        df_db = df.copy()
        
        # Ensure required columns exist
        required_columns = ['menu_item_id', 'restaurant_id', 'item_name']
        for col in required_columns:
            if col not in df_db.columns:
                raise ValueError(f"Required column missing: {col}")
        
        # Rename columns
        column_mapping = {
            'menu_item_id': 'id',
            'extracted_ingredients': 'ingredients',
            'potential_allergens': 'allergens'
        }
        
        for old_col, new_col in column_mapping.items():
            if old_col in df_db.columns:
                df_db = df_db.rename(columns={old_col: new_col})
        
        # Convert datetime columns
        datetime_columns = ['scraped_at', 'processed_at']
        for col in datetime_columns:
            if col in df_db.columns:
                df_db[col] = pd.to_datetime(df_db[col], errors='coerce')
        
        # Convert JSON columns
        json_columns = ['ingredients', 'allergens', 'nutritional_info']
        for col in json_columns:
            if col in df_db.columns:
                df_db[col] = df_db[col].apply(self._safe_json_convert)
        
        # Handle boolean columns
        df_db['is_active'] = True
        df_db['availability'] = True
        
        # Select only database columns
        db_columns = [col.name for col in self.menu_items_table.columns]
        available_columns = [col for col in db_columns if col in df_db.columns]
        df_db = df_db[available_columns]
        
        return df_db
    
    def _safe_json_convert(self, value) -> Optional[Dict]:
        """Safely convert value to JSON"""
        if pd.isna(value):
            return None
        
        if isinstance(value, (dict, list)):
            return value
        
        if isinstance(value, str):
            try:
                return json.loads(value)
            except (json.JSONDecodeError, ValueError):
                return None
        
        return None
    
    def _load_data_batch(self, df: pd.DataFrame, table_name: str, table_obj) -> Dict[str, int]:
        """Load data in batches with upsert logic"""
        batch_size = self.config.etl.batch_size
        total_rows = len(df)
        
        stats = {'inserted': 0, 'updated': 0, 'failed': 0}
        
        session = self.Session()
        
        try:
            for start_idx in range(0, total_rows, batch_size):
                end_idx = min(start_idx + batch_size, total_rows)
                batch_df = df.iloc[start_idx:end_idx]
                
                logger.info(f"Processing batch {start_idx//batch_size + 1}: rows {start_idx}-{end_idx}")
                
                batch_stats = self._upsert_batch(session, batch_df, table_name, table_obj)
                
                stats['inserted'] += batch_stats['inserted']
                stats['updated'] += batch_stats['updated']
                stats['failed'] += batch_stats['failed']
            
            session.commit()
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error in batch loading: {str(e)}")
            raise
        finally:
            session.close()
        
        return stats
    
    def _upsert_batch(self, session, batch_df: pd.DataFrame, table_name: str, table_obj) -> Dict[str, int]:
        """Upsert a batch of data"""
        stats = {'inserted': 0, 'updated': 0, 'failed': 0}
        
        for _, row in batch_df.iterrows():
            try:
                # Convert row to dict and handle NaN values
                row_dict = row.to_dict()
                row_dict = {k: (None if pd.isna(v) else v) for k, v in row_dict.items()}
                
                # Check if record exists
                existing = session.execute(
                    text(f"SELECT id FROM {table_name} WHERE id = :id"),
                    {'id': row_dict['id']}
                ).fetchone()
                
                if existing:
                    # Update existing record
                    row_dict['updated_at'] = datetime.utcnow()
                    
                    update_stmt = table_obj.update().where(
                        table_obj.c.id == row_dict['id']
                    ).values(**row_dict)
                    
                    session.execute(update_stmt)
                    stats['updated'] += 1
                    
                else:
                    # Insert new record
                    row_dict['created_at'] = datetime.utcnow()
                    row_dict['updated_at'] = datetime.utcnow()
                    
                    insert_stmt = table_obj.insert().values(**row_dict)
                    session.execute(insert_stmt)
                    stats['inserted'] += 1
                
            except Exception as e:
                logger.error(f"Error processing row {row_dict.get('id', 'unknown')}: {str(e)}")
                stats['failed'] += 1
                continue
        
        return stats
    
    def _log_etl_job(self, job_id: str, job_type: str, source_file: str,
                    target_table: str, records_processed: int, records_inserted: int,
                    records_updated: int, records_failed: int, status: str,
                    start_time: datetime, end_time: datetime,
                    error_message: str = None):
        """Log ETL job execution"""
        
        duration = (end_time - start_time).total_seconds()
        
        job_data = {
            'id': job_id,
            'job_type': job_type,
            'source_file': source_file,
            'target_table': target_table,
            'records_processed': records_processed,
            'records_inserted': records_inserted,
            'records_updated': records_updated,
            'records_failed': records_failed,
            'status': status,
            'error_message': error_message,
            'start_time': start_time,
            'end_time': end_time,
            'duration_seconds': duration,
            'created_at': datetime.utcnow()
        }
        
        session = self.Session()
        try:
            insert_stmt = self.etl_jobs_table.insert().values(**job_data)
            session.execute(insert_stmt)
            session.commit()
        except Exception as e:
            logger.error(f"Error logging ETL job: {str(e)}")
            session.rollback()
        finally:
            session.close()
    
    def save_quality_report(self, report, data_type: str, source_file: str):
        """Save data quality report to database"""
        
        report_data = {
            'id': str(uuid.uuid4()),
            'data_type': data_type,
            'source_file': source_file,
            'total_records': report.total_records,
            'valid_records': report.valid_records,
            'invalid_records': report.invalid_records,
            'quality_score': report.quality_score,
            'issues': report.issues,
            'null_percentages': report.null_percentages,
            'duplicate_count': report.duplicate_count,
            'created_at': datetime.utcnow()
        }
        
        session = self.Session()
        try:
            insert_stmt = self.data_quality_table.insert().values(**report_data)
            session.execute(insert_stmt)
            session.commit()
            logger.info(f"Quality report saved for {data_type}")
        except Exception as e:
            logger.error(f"Error saving quality report: {str(e)}")
            session.rollback()
        finally:
            session.close()
    
    def get_restaurant_count(self) -> int:
        """Get total number of restaurants in database"""
        session = self.Session()
        try:
            result = session.execute(
                text("SELECT COUNT(*) FROM restaurants WHERE is_active = true")
            ).scalar()
            return result or 0
        finally:
            session.close()
    
    def get_menu_item_count(self) -> int:
        """Get total number of menu items in database"""
        session = self.Session()
        try:
            result = session.execute(
                text("SELECT COUNT(*) FROM menu_items WHERE is_active = true")
            ).scalar()
            return result or 0
        finally:
            session.close()
    
    def get_latest_etl_jobs(self, limit: int = 10) -> List[Dict]:
        """Get latest ETL job logs"""
        session = self.Session()
        try:
            result = session.execute(
                text("""
                    SELECT * FROM etl_jobs 
                    ORDER BY created_at DESC 
                    LIMIT :limit
                """),
                {'limit': limit}
            ).fetchall()
            
            return [dict(row._mapping) for row in result]
        finally:
            session.close()
    
    def cleanup_old_data(self, days: int = 90):
        """Clean up old inactive records"""
        cutoff_date = datetime.utcnow() - pd.Timedelta(days=days)
        
        session = self.Session()
        try:
            # Delete old inactive restaurants
            restaurant_result = session.execute(
                text("""
                    DELETE FROM restaurants 
                    WHERE is_active = false AND updated_at < :cutoff_date
                """),
                {'cutoff_date': cutoff_date}
            )
            
            # Delete old inactive menu items
            menu_result = session.execute(
                text("""
                    DELETE FROM menu_items 
                    WHERE is_active = false AND updated_at < :cutoff_date
                """),
                {'cutoff_date': cutoff_date}
            )
            
            session.commit()
            
            logger.info(f"Cleaned up {restaurant_result.rowcount} restaurants and {menu_result.rowcount} menu items")
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error during cleanup: {str(e)}")
            raise
        finally:
            session.close()

# CLI interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database Loader")
    parser.add_argument("--action", choices=['create-tables', 'load-restaurants', 'load-menus', 'status'], 
                       required=True)
    parser.add_argument("--data-path", help="Path to data file")
    parser.add_argument("--cleanup-days", type=int, default=90, help="Days for cleanup")
    
    args = parser.parse_args()
    
    loader = DatabaseLoader()
    
    if args.action == 'create-tables':
        loader.create_tables()
        print("Database tables created")
    
    elif args.action == 'load-restaurants':
        if not args.data_path:
            print("Data path required for loading")
            sys.exit(1)
        
        stats = loader.load_restaurants(args.data_path)
        print(f"Restaurant loading completed: {stats}")
    
    elif args.action == 'load-menus':
        if not args.data_path:
            print("Data path required for loading")
            sys.exit(1)
        
        stats = loader.load_menu_items(args.data_path)
        print(f"Menu loading completed: {stats}")
    
    elif args.action == 'status':
        restaurant_count = loader.get_restaurant_count()
        menu_count = loader.get_menu_item_count()
        recent_jobs = loader.get_latest_etl_jobs(5)
        
        print(f"Database Status:")
        print(f"- Restaurants: {restaurant_count}")
        print(f"- Menu Items: {menu_count}")
        print(f"- Recent ETL Jobs: {len(recent_jobs)}")
        
        for job in recent_jobs:
            print(f"  - {job['job_type']}: {job['status']} ({job['records_processed']} records)")