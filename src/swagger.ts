import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth(
    {
      type: 'http',
      name: 'Bearer auth',
      in: 'Moderator avtoriszatsiya',
      description: 'Bearer token',
    },
    'admin_auth',
  )
  .setTitle('API doc for Nest Gym')
  .setDescription("Qo'ldan kelgancha qilindi;)")
  .setVersion('1.0.0')
  .build();

export const swaggerOptions: SwaggerCustomOptions = {
  customSiteTitle: 'Nest Gym Api',
  customfavIcon: 'https://www.svgrepo.com/show/195284/weights-gym.svg',
  customCss: `
        .topbar {
            background-color: #315881 !important;
            padding: 20px !important;
        }
        .topbar-wrapper {
          content:url(https://www.svgrepo.com/show/195284/weights-gym.svg);
          width:100px;
          height:50px;
        }
        .swagger-ui .topbar { 
          border-bottom: 5px solid #5dc6d1;
        }`,
};
