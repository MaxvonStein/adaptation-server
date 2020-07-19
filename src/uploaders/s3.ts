import { Stream } from "stream";

import AWS from "aws-sdk";
import * as stream from "stream";
import { ReadStream } from "fs";

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  destinationBucketName: string;
  region?: string;
};

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export namespace ApolloServerFileUploads {
  export type File = {
    filename: string;
    mimetype: string;
    encoding: string;
    stream?: ReadStream;
    // ^ where's this defined?
  };

  export type UploadedFileResponse = {
    filename: string;
    mimetype: string;
    encoding: string;
    url: string;
  };

  export interface IUploader {
    singleFileUploadResolver: (
      parent,
      { file }: { file: File }
    ) => Promise<UploadedFileResponse>;
  }
}

export class AWSS3Uploader implements ApolloServerFileUploads.IUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    // could the AWS duplication be throwing off the compiler?
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.region || "us-east-1",
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });

    this.s3 = new AWS.S3();
    this.config = config;
  }

  private createUploadStream(key: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.destinationBucketName,
          Key: key,
          Body: pass,
        })
        .promise(),
    };
  }

  private createDestinationFilePath(
    fileName: string,
    mimetype: string,
    encoding: string
  ): string {
    return fileName;
  }

  async singleFileUploadResolver(
    parent,
    { file }: { file: ApolloServerFileUploads.File }
  ): Promise<ApolloServerFileUploads.UploadedFileResponse> {
    const { stream, filename, mimetype, encoding } = await file;

    const filePath = this.createDestinationFilePath(
      filename,
      mimetype,
      encoding
    );

    // create an upload stream that goes to S3
    const uploadStream = this.createUploadStream(filePath);

    // pipe the file data into the upload stream
    stream.pipe(uploadStream.writeStream);

    // start the stream
    const result = await uploadStream.promise;

    // save link, result.Location to data here

    return { filename, mimetype, encoding, url: "" };
  }
}
