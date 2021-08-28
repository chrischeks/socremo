import IResponse from '@/@universal/interfaces/response.interface';
import md5 from 'md5';
import config from 'config';
import fetch from 'node-fetch';
import xml2js = require('xml2js');

const { username, password, SMS_TOKEN, SMS_ACCOUNT_ID } = config;
console.log(username, password, SMS_TOKEN, SMS_ACCOUNT_ID);

class UniversalService {
  protected smsHeaders = { 'Content-Type': 'application/json', Authorization: SMS_TOKEN };
  public successResponse = (data = null): IResponse => {
    return { statusCode: 200, status: true, message: 'success', data };
  };

  public failureResponse = (message: string): IResponse => {
    return { statusCode: 400, status: false, message };
  };

  protected generateAccountNumber = async (): Promise<string> => {
    return `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  };

  protected hashPasswordToMD5 = async () => {
    const a = Date.now();
    let strBuf = '';
    strBuf += new Date().getFullYear();
    strBuf += await this.zeroLeadValue(new Date().getMonth() + 1);
    strBuf += await this.zeroLeadValue(new Date().getDate());
    strBuf += username;
    strBuf += password;
    let hash = md5(strBuf);
    hash = hash.toString();
    while (hash.length < 32) {
      hash = hash + '0';
    }
    return hash;
  };

  protected zeroLeadValue = async value => {
    if (value > 9) return value;
    else return '0' + value;
  };

  protected addBaseXML = async body => {
    console.log(await this.hashPasswordToMD5());

    return {
      ...body,
      validationToken: await this.hashPasswordToMD5(),
      client: 'SOC',
      username: 'RUBIKPAY',
      workstation: 'RUBIKPAY',
    };
  };

  // protected soapNamespace = () => {
  //   return {
  //     'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
  //     'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
  //     'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
  //   };
  // };

  protected centralAPICaller = async (api: string, requestBody, headers, method: string, isXML) => {
    // let payLoad = { headers, method, body: requestBody ? JSON.stringify(requestBody) : null };

    let payLoad = { headers, method };
    if (isXML === true) {
      payLoad['body'] = requestBody;
    } else {
      requestBody ? (payLoad['body'] = JSON.stringify(requestBody)) : payLoad;
    }
    console.log(payLoad, api, 'pppppppppppppppppppp');

    try {
      const response = await fetch(api, payLoad);
      const { ok, statusText, status: statusCode } = response;
      console.log(statusCode, 'statusCode');

      if (ok) {
        console.log(response, '=========================');
        return { statusCode, result: await response.text() };
        // return response.json();
      } else {
        return { statusText, statusCode, result: await response.text() };
      }
    } catch (error) {
      console.log(error, 'jjjjjjjjjjj');

      throw new Error('Operation failed');
    }
  };
  protected makeSoapAPICall = async (parent, child, payLoad, endpoint, responseType) => {
    console.log('enter');

    const builder = new xml2js.Builder();
    const reqBody = builder.buildObject({
      'soap:Envelope': {
        $: {
          'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        },
        'soap:Body': {
          [parent]: {
            $: { xmlns: 'http://service.jbank.sysapp.com/' },
            [child]: { $: { xmlns: '' }, ...(await this.addBaseXML(payLoad)) },
          },
        },
      },
    });
    const response = await this.centralAPICaller(endpoint, reqBody, { 'content-type': 'application/xml' }, 'post', true);

    const { statusCode, result } = response;
    if (statusCode == 500) return this.failureResponse(result);
    const parsedData = await xml2js.parseStringPromise(result);
    const formatedRes = parsedData['soap:Envelope']['soap:Body'][0][`ns1:${responseType}`][0]['return'][0];
    return formatedRes;
  };

  protected processSendSMS = async (body, metaData): Promise<IResponse> => {
    let { mobileNumber, text } = body;
    const reqBody = { id: '123459', to: [`234${mobileNumber.substring(1)}`], sender_mask: 'ACCION', priority: 'high', body: `${text}` };
    const messageURL = `https://konnect.kirusa.com/api/v1/Accounts/${SMS_ACCOUNT_ID}/Messages`;
    const response = await this.centralAPICaller(messageURL, reqBody, this.smsHeaders, 'POST', metaData);
    const { statusCode, result } = response;
    if (statusCode.toString().charAt(0) !== '2') return this.failureResponse(result);
    return this.successResponse();
  };
}
export default UniversalService;
