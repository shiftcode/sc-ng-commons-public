export function isAwsLambdaEnv(): boolean {
  return process && !!process.env['AWS_EXECUTION_ENV']
}
