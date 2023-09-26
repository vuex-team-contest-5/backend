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
  .setTitle('API doc for ResPos')
  .setDescription("Qo'ldan kelgancha qilindi;)")
  .setVersion('1.0.0')
  .build();

export const swaggerOptions: SwaggerCustomOptions = {
  customSiteTitle: 'ResPos Api',
  customfavIcon: 'https://pos.in1.uz/api/static/invan.png',
  customCss: `
        .topbar {
            background-color: #315881 !important;
            padding: 20px !important;
        }
        .topbar-wrapper img {
          content:url(https://pos.in1.uz/api/static/invan_swagger_logo.png);
          width:auto;
          height:auto;
        }
        .swagger-ui .topbar { 
          border-bottom: 5px solid #5dc6d1;
        }`,
};
