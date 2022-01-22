/**
 * check whether the env var `AWS_EXECUTION_ENV` is set
 */
export function isAwsLambdaEnv(): boolean {
  return process && !!process.env['AWS_EXECUTION_ENV']
}
