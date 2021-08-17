const AWS = require('aws-sdk')
import AWSBucket from './awsBucket'

let s3

function init(param) {
  let options = { apiVersion: '2006-03-01' }

  AWS.config = new AWS.Config({
    accessKeyId: param.access_key,
    secretAccessKey: param.secret_key,
    region: param.region,
  })

  //minio 需要处理的
  if (param.endpoint) {
    AWS.config.update({
      endpoint: param.endpoint,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    })
  }

  s3 = new AWS.S3(options)
}

function getBuckets(callback) {
  _getBuckets(s3, callback)
}

function _getBuckets(s3, callback) {
  s3.listBuckets()
    .promise()
    .then(data => {
      data.Buckets.forEach((item, index) => {
        data.Buckets[index].name = data.Buckets[index].Name
      })
      callback && callback(null, data.Buckets)
    })
    .catch(error => {
      callback && callback(error)
    })
}

function generateBucket(name) {
  return new AWSBucket(name, s3)
}

export default { init, getBuckets, _getBuckets, generateBucket }
