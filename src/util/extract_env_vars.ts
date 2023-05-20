// Copying from myself
// https://gist.github.com/adriangabardo/f1cff946da55473e1b9572f1246070e4

/**
 * A utility method to safely extract environment variables.
 * By default, if an environment variable is asked to be extracted but it is missing, this method will throw an error.
 * @param options - Additional options for this method's behaviour, including deciding if it should throw when a variable is missing.
 * @param environmentVariables - A spread of environment variable keys to be fetched from process.env.
 * @returns A new object with each environmentVariables key in it. Unless throwOnError is false, all environmentVariables params will be present.
 */
export const extract_environment_variables = <T extends string[]>(
  { throwOnError = true }: { throwOnError?: boolean },
  ...environmentVariables: T
): Record<T[number], string> =>
  environmentVariables.reduce((environment_variables, key) => {
    const value = process.env[key];

    if (!value || value === undefined || value === null) {
      if (throwOnError) {
        throw new Error(`${key} not found in environment variables.`);
      } else return environment_variables;
    }

    return { ...environment_variables, [key]: value };
  }, {} as Record<T[number], string>);
