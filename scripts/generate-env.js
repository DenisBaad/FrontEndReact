import fs from 'fs';

const targetPath = './src/environments/Environment.prod.ts';

const envConfigFile = `
export const environment = {
  production: true,
  Aquiles_URL: '${process.env.AQUILES_URL}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Arquivo environment.prod.ts gerado em: ${targetPath}`);