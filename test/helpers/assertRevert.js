'use strict';

/**
 * Exports.
 */

module.exports = async (promise, expectedErrorMessage) => {
  try {
    await promise;

    assert.fail('Expected revert not received');
  } catch (error) {
    assert(error.message.search('revert') >= 0, `Expected "revert", got ${error} instead`);

    assert(/Returned error: VM Exception while processing transaction: revert/.test(error.message));

    if (expectedErrorMessage === undefined) {
      return;
    }

    assert(RegExp(expectedErrorMessage).test(error.message), `Error \`${error.message}\` does not match the regex \`${expectedErrorMessage}\``);
  }
};
