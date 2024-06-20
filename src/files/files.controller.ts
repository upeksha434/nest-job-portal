import { Body, Controller,FileTypeValidator,MaxFileSizeValidator,Param,ParseFilePipe,Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDto } from './dto/upload.dto';
import { PrismaService } from 'src/prisma.service';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}


@Post('/save-file-s3/:userId')
@UseInterceptors(FileInterceptor('file'))
async saveFileS3(@UploadedFile(
  new ParseFilePipe({
    validators: [
      //new MaxFileSizeValidator({maxSize:1000}),
      new FileTypeValidator({fileType:'image/jpeg'})
    ]
  })
) file: Express.Multer.File, @Body() body:object, @Param('userId') userId:number): Promise<any> {
  
  let result = await this.filesService.saveFileS3(file, body['ext'],userId);
  console.log("imageURL",result)
  //result mean file name. should upload this in to the database
  return result;
}


  @Post('/get-file-s3')
  async getFileS3(@Body() body:object): Promise<any> {
    let result= await this.filesService.getFileS3(body);
    console.log(result,"get result");
    return result;
  }


}

//   @Post()
//   create(@Body() createFileDto: CreateFileDto) {
//     return this.filesService.create(createFileDto);
//   }

//   @Get()
//   findAll() {
//     return this.filesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.filesService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
//     return this.filesService.update(+id, updateFileDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.filesService.remove(+id);
//   }
// }
