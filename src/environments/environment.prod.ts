import config from '../../auth_config.json';

const { domain, clientId, audience, apiUri, errorPath, } = config.production as {
  domain: string;
  clientId: string;
  audience?: string;
  apiUri: string;
  errorPath: string;
};

export const environment = {
  production: true,

  endpoint_url: "http://ec2-44-193-79-71.compute-1.amazonaws.com:5000",
 // endpoint_url:"http://localhost:5000/buildingblocks/api/v1",
 //endpoint_url:"http://bbc-dev-api.eba-wumjpfkg.us-east-1.elasticbeanstalk.com",
};
