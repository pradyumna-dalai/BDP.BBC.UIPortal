// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.


export const environment = {
    production: false,
  
    sessionInfoInterval: 25 * 60 * 1000,
    sessionTimeoutInterval: 5 * 60 * 1000,
    sessionDialogInterval: 1 * 60 * 1000,
    
    // endpoint_url:"http://localhost:5000/buildingblocks/api/v1",
 // endpoint_url:"http://bbc-dev-api.eba-wumjpfkg.us-east-1.elasticbeanstalk.com",
  endpoint_url:"ec2-54-86-49-91.compute-1.amazonaws.com:5000",
  };
  