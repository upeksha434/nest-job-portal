import { Injectable } from '@nestjs/common';

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Readable } from 'node:stream';

import { v4 as uuidv4 } from 'uuid';

import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';
import { access } from 'node:fs';
import { UploadDto } from './dto/upload.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FilesService {

    s3Client: S3Client;
    constructor(private config: ConfigService,private prisma: PrismaService) {
        this.s3Client = new S3Client({
            region:this.config.getOrThrow('AWS_S3_REGION'),
        });
    }


    async uploadNewProfilePic(file:Express.Multer.File,ext:string,profilePicId:number):Promise<any>{
      if (!file) {
        throw new Error('File is undefined or null');
      }

      const fileName = `${uuidv4()}${ext}`;
      const command = new PutObjectCommand({
          Bucket: 'myjopportal-sem6',
          Key: fileName,
          Body: file.buffer,
          ContentType:'image/jpeg',
      });
      //should also remove the previous picture from bucket

      const response = await this.s3Client.send(command);

      const region = this.config.getOrThrow('AWS_S3_REGION');
      const bucketName = 'myjopportal-sem6';
      const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

      await this.prisma.profilePics.update({
        where:{
          id:profilePicId
        },
        data:{
          url:imageUrl
        }
      })
      return imageUrl;



    }


    async saveFileS3(file:Express.Multer.File, ext:string, userId:number): Promise<any> {
      console.log(this.config.get('AWS_ACCESS_KEY_ID'))
        if (!file) {
            throw new Error('File is undefined or null');
        }

    
        const fileName = `${uuidv4()}${ext}`;
     
        const command = new PutObjectCommand({
            Bucket: 'myjopportal-sem6',
            Key: fileName,
            Body: file.buffer,
            ContentType:'image/jpeg',
        });
    
        const response = await this.s3Client.send(command);

        // Construct the URL of the uploaded image
        const region = this.config.getOrThrow('AWS_S3_REGION');
        const bucketName = 'myjopportal-sem6';
        const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;


        const data:UploadDto = {
          userId: userId,
          url: imageUrl
        }
        await this.storeURL(data);
        

        
        return imageUrl;
    }

    async storeURL(data:UploadDto): Promise<any> {
      await this.prisma.profilePics.create({
        data: {
          userId: parseInt(data.userId.toString(), 10),
          url: data.url
        }
      })

    }
    async removeURL(id:number): Promise<any> {
      await this.prisma.profilePics.delete({
        where: {
          id: id
        }
      })
    }
    

    async getFileS3(body: object): Promise<any> {
        const command = new GetObjectCommand({
            Bucket:'myjopportal-sem6',
            Key: body['file-name'],
        });

        const response = await this.s3Client.send(command);

        const fileByteArray = await response.Body.transformToByteArray();


        fs.writeFile(path.join(__dirname, '..', '..', '..', 'uploads', body['file-name']), fileByteArray);

        

        return {
            'file': response.$metadata,
        };
    }
}
