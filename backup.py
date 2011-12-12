#!/usr/bin/python
from boto.s3.connection import S3Connection
from boto.s3.key import Key
import sys
import os
import time
import tarfile

def tarToS3(directoryName='/Seating', s3Bucket='2seat', s3Key=None, s3AcctId='AKIAIFUNDQAYFXW6RURA', s3SecretAccess='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' ):
        contents = os.listdir(directoryName)
	curtime=str(time.strftime('%d%m%H%M%S'))
	isdb=0
        if s3Key==None:
                s3Key="backup."+curtime+".tar.gx"
        else:
		if s3Key=='db' or s3Key=='DB':
			isdb=1
                s3Key+='-'+curtime+'.tar.gz'

        backupFile = "/backups/"+s3Key
	os.system("mysqldump --all-databases > /backups/dbs/"+curtime+".sqldump")
        tar = tarfile.open(backupFile, "w:gz")
	tar.add("/backups/dbs/"+curtime+".sqldump")	
	if isdb==0:
	        for item in contents:
        	        tar.add(directoryName+'/'+item)
        tar.close()

        if s3SecretAccess==None:
                conn = S3Connection()
        else:
                conn = S3Connection(s3AcctId, s3SecretAccess)

        bucket = conn.get_bucket(s3Bucket)
        k = Key(bucket)
        k.key = s3Key
	k.set_contents_from_filename(backupFile)


if len(sys.argv) > 1:
	newKey=sys.argv[1]
else:
	newKey='Regular'
	
tarToS3(s3Key=newKey)
