import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
const start = async () => {
  try {
    const PORT = process.env.PORT || 3030
    const app = await NestFactory.create(AppModule)

    app.use(cookieParser())
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(PORT,()=> {
      console.log(`Server has been started at ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()
