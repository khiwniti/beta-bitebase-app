"""
Data Lake utilities for storing and retrieving data
"""
import json
import pickle
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import pandas as pd
import boto3
from botocore.exceptions import ClientError
from config.settings import settings
from utils.logger import get_logger

logger = get_logger("datalake")

class DataLakeManager:
    """Manages data storage and retrieval in the data lake"""
    
    def __init__(self):
        self.config = settings.datalake
        self.base_path = Path(self.config.base_path)
        
        # Initialize storage backend
        if self.config.type == "s3":
            self._init_s3()
        elif self.config.type == "minio":
            self._init_minio()
        else:
            self._init_local()
    
    def _init_local(self):
        """Initialize local file system storage"""
        self.storage_type = "local"
        self.base_path.mkdir(exist_ok=True, parents=True)
        
        # Create data lake structure
        for layer in ["raw", "processed", "curated", "archive"]:
            (self.base_path / layer).mkdir(exist_ok=True)
            
        logger.info(f"Initialized local data lake at {self.base_path}")
    
    def _init_s3(self):
        """Initialize AWS S3 storage"""
        self.storage_type = "s3"
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=self.config.access_key,
            aws_secret_access_key=self.config.secret_key,
            region_name=self.config.region
        )
        
        # Create bucket if it doesn't exist
        try:
            self.s3_client.head_bucket(Bucket=self.config.bucket_name)
        except ClientError:
            self.s3_client.create_bucket(
                Bucket=self.config.bucket_name,
                CreateBucketConfiguration={'LocationConstraint': self.config.region}
            )
            
        logger.info(f"Initialized S3 data lake: {self.config.bucket_name}")
    
    def _init_minio(self):
        """Initialize MinIO storage"""
        from minio import Minio
        
        self.storage_type = "minio"
        self.minio_client = Minio(
            self.config.endpoint_url.replace('http://', '').replace('https://', ''),
            access_key=self.config.access_key,
            secret_key=self.config.secret_key,
            secure=self.config.endpoint_url.startswith('https')
        )
        
        # Create bucket if it doesn't exist
        if not self.minio_client.bucket_exists(self.config.bucket_name):
            self.minio_client.make_bucket(self.config.bucket_name)
            
        logger.info(f"Initialized MinIO data lake: {self.config.bucket_name}")
    
    def save_raw_data(self, data: Union[Dict, List, pd.DataFrame], 
                     source: str, data_type: str, 
                     timestamp: Optional[datetime] = None) -> str:
        """
        Save raw data to the data lake
        
        Args:
            data: Data to save
            source: Data source (e.g., 'wongnai')
            data_type: Type of data (e.g., 'restaurants', 'menus')
            timestamp: Optional timestamp, defaults to now
            
        Returns:
            Path where data was saved
        """
        if timestamp is None:
            timestamp = datetime.now()
            
        # Generate file path
        date_str = timestamp.strftime("%Y/%m/%d")
        timestamp_str = timestamp.strftime("%Y%m%d_%H%M%S")
        filename = f"{source}_{data_type}_{timestamp_str}.json"
        file_path = f"raw/{source}/{data_type}/{date_str}/{filename}"
        
        # Convert data to JSON if needed
        if isinstance(data, pd.DataFrame):
            data_json = data.to_json(orient='records', date_format='iso')
            data_dict = json.loads(data_json)
        else:
            data_dict = data
            
        # Add metadata
        metadata = {
            "source": source,
            "data_type": data_type,
            "timestamp": timestamp.isoformat(),
            "record_count": len(data_dict) if isinstance(data_dict, list) else 1,
            "schema_version": "1.0"
        }
        
        payload = {
            "metadata": metadata,
            "data": data_dict
        }
        
        # Save data
        self._save_file(file_path, json.dumps(payload, ensure_ascii=False, indent=2))
        
        logger.info(f"Saved raw data to {file_path}")
        return file_path
    
    def save_processed_data(self, data: pd.DataFrame, 
                          source: str, data_type: str,
                          processing_stage: str,
                          timestamp: Optional[datetime] = None) -> str:
        """
        Save processed data to the data lake
        
        Args:
            data: Processed DataFrame
            source: Data source
            data_type: Type of data
            processing_stage: Stage of processing (e.g., 'cleaned', 'enriched')
            timestamp: Optional timestamp
            
        Returns:
            Path where data was saved
        """
        if timestamp is None:
            timestamp = datetime.now()
            
        date_str = timestamp.strftime("%Y/%m/%d")
        timestamp_str = timestamp.strftime("%Y%m%d_%H%M%S")
        filename = f"{source}_{data_type}_{processing_stage}_{timestamp_str}.parquet"
        file_path = f"processed/{source}/{data_type}/{processing_stage}/{date_str}/{filename}"
        
        # Save as Parquet for better performance
        if self.storage_type == "local":
            full_path = self.base_path / file_path
            full_path.parent.mkdir(parents=True, exist_ok=True)
            data.to_parquet(full_path, index=False)
        else:
            # For cloud storage, save to temporary file first
            import tempfile
            with tempfile.NamedTemporaryFile(suffix='.parquet', delete=False) as tmp:
                data.to_parquet(tmp.name, index=False)
                self._upload_file(tmp.name, file_path)
                Path(tmp.name).unlink()  # Clean up temp file
        
        logger.info(f"Saved processed data to {file_path}")
        return file_path
    
    def save_curated_data(self, data: pd.DataFrame,
                         dataset_name: str,
                         version: str = "latest") -> str:
        """
        Save curated data ready for consumption
        
        Args:
            data: Curated DataFrame
            dataset_name: Name of the dataset
            version: Version of the dataset
            
        Returns:
            Path where data was saved
        """
        timestamp = datetime.now()
        date_str = timestamp.strftime("%Y/%m/%d")
        timestamp_str = timestamp.strftime("%Y%m%d_%H%M%S")
        
        filename = f"{dataset_name}_{version}_{timestamp_str}.parquet"
        file_path = f"curated/{dataset_name}/{version}/{date_str}/{filename}"
        
        # Save data
        if self.storage_type == "local":
            full_path = self.base_path / file_path
            full_path.parent.mkdir(parents=True, exist_ok=True)
            data.to_parquet(full_path, index=False)
        else:
            import tempfile
            with tempfile.NamedTemporaryFile(suffix='.parquet', delete=False) as tmp:
                data.to_parquet(tmp.name, index=False)
                self._upload_file(tmp.name, file_path)
                Path(tmp.name).unlink()
        
        # Also save as "latest" version
        if version != "latest":
            latest_path = file_path.replace(f"/{version}/", "/latest/")
            if self.storage_type == "local":
                latest_full_path = self.base_path / latest_path
                latest_full_path.parent.mkdir(parents=True, exist_ok=True)
                data.to_parquet(latest_full_path, index=False)
            else:
                import tempfile
                with tempfile.NamedTemporaryFile(suffix='.parquet', delete=False) as tmp:
                    data.to_parquet(tmp.name, index=False)
                    self._upload_file(tmp.name, latest_path)
                    Path(tmp.name).unlink()
        
        logger.info(f"Saved curated data to {file_path}")
        return file_path
    
    def load_data(self, file_path: str, format: str = "auto") -> Union[Dict, pd.DataFrame]:
        """
        Load data from the data lake
        
        Args:
            file_path: Path to the file
            format: File format ('json', 'parquet', 'auto')
            
        Returns:
            Loaded data
        """
        if format == "auto":
            format = "parquet" if file_path.endswith('.parquet') else "json"
        
        if self.storage_type == "local":
            full_path = self.base_path / file_path
            
            if format == "json":
                with open(full_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            elif format == "parquet":
                return pd.read_parquet(full_path)
        else:
            # Download from cloud storage
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                self._download_file(file_path, tmp.name)
                
                if format == "json":
                    with open(tmp.name, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                elif format == "parquet":
                    data = pd.read_parquet(tmp.name)
                
                Path(tmp.name).unlink()  # Clean up
                return data
    
    def list_files(self, prefix: str = "") -> List[str]:
        """
        List files in the data lake
        
        Args:
            prefix: Path prefix to filter files
            
        Returns:
            List of file paths
        """
        if self.storage_type == "local":
            base_path = self.base_path / prefix if prefix else self.base_path
            files = []
            for file_path in base_path.rglob("*"):
                if file_path.is_file():
                    relative_path = file_path.relative_to(self.base_path)
                    files.append(str(relative_path))
            return sorted(files)
        else:
            # List from cloud storage
            files = []
            if self.storage_type == "s3":
                response = self.s3_client.list_objects_v2(
                    Bucket=self.config.bucket_name,
                    Prefix=prefix
                )
                for obj in response.get('Contents', []):
                    files.append(obj['Key'])
            elif self.storage_type == "minio":
                objects = self.minio_client.list_objects(
                    self.config.bucket_name,
                    prefix=prefix,
                    recursive=True
                )
                for obj in objects:
                    files.append(obj.object_name)
            
            return sorted(files)
    
    def _save_file(self, file_path: str, content: str):
        """Save file content"""
        if self.storage_type == "local":
            full_path = self.base_path / file_path
            full_path.parent.mkdir(parents=True, exist_ok=True)
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
        else:
            self._upload_content(file_path, content)
    
    def _upload_content(self, file_path: str, content: str):
        """Upload content to cloud storage"""
        if self.storage_type == "s3":
            self.s3_client.put_object(
                Bucket=self.config.bucket_name,
                Key=file_path,
                Body=content.encode('utf-8')
            )
        elif self.storage_type == "minio":
            import io
            self.minio_client.put_object(
                self.config.bucket_name,
                file_path,
                io.BytesIO(content.encode('utf-8')),
                len(content.encode('utf-8'))
            )
    
    def _upload_file(self, local_path: str, remote_path: str):
        """Upload file to cloud storage"""
        if self.storage_type == "s3":
            self.s3_client.upload_file(local_path, self.config.bucket_name, remote_path)
        elif self.storage_type == "minio":
            self.minio_client.fput_object(self.config.bucket_name, remote_path, local_path)
    
    def _download_file(self, remote_path: str, local_path: str):
        """Download file from cloud storage"""
        if self.storage_type == "s3":
            self.s3_client.download_file(self.config.bucket_name, remote_path, local_path)
        elif self.storage_type == "minio":
            self.minio_client.fget_object(self.config.bucket_name, remote_path, local_path)

# Global data lake manager instance
datalake = DataLakeManager()