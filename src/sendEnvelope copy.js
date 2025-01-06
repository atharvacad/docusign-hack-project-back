const fs = require('fs');
const docusign = require('docusign-esign');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Function to create the envelope definition
function makeEnvelope(args) {
  console.log('docFile:', args.docFile); // Log the file path

  let docPdfBytes;
  docPdfBytes = fs.readFileSync(args.docFile);

  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = 'Please sign this document';

  let doc = new docusign.Document();
  let docb64 = Buffer.from(docPdfBytes).toString('base64');
  doc.documentBase64 = docb64;
  doc.name = 'Agreement Document';
  doc.fileExtension = 'pdf';
  doc.documentId = '1';

  env.documents = [doc];

  let signer1 = docusign.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    recipientId: '1',
    routingOrder: '1',
  });

  let signHere = docusign.SignHere.constructFromObject({
    anchorString: '/sn1/',
    anchorYOffset: '10',
    anchorUnits: 'pixels',
    anchorXOffset: '20',
  });

  let signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere],
  });
  signer1.tabs = signer1Tabs;

  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1],
  });
  env.recipients = recipients;

  env.status = args.status;

  return env;
}

// Function to send the envelope
const sendEnvelope = async (args) => {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);
  let results = null;

  let envelope = makeEnvelope(args.envelopeArgs);

  results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelope,
  });
  let envelopeId = results.envelopeId;

  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
  return { envelopeId: envelopeId };
};

module.exports = { sendEnvelope };