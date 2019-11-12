'use strict';

/**
 * Module dependencies.
 */

const Authorizable = artifacts.require('Authorizable');
const assertRevert = require('../../helpers/assertRevert');

/**
 * `Aiuthorizable´ tests.
 */

contract('Authorizable', ([, owner, authorized, unauthorized, other]) => {
  beforeEach(async function() {
    this.auth = await Authorizable.new(owner, { from: owner });

    await this.auth.authorize(authorized, { from: owner });
  });

  describe('authorizes users', () => {
    it('that have not been authorized', async function() {
      assert.equal(await this.auth.authorized(unauthorized), false);

      await this.auth.authorize(unauthorized, { from: owner });

      assert.equal(await this.auth.authorized(unauthorized), true);
    });

    it('unless they are already authorized', async function() {
      assert.equal(await this.auth.authorized(authorized), true);

      await assertRevert(this.auth.authorize(authorized, { from: owner }), 'Already authorized');
    });

    it('unless trying to authorize the owner', async function() {
      assert.equal(await this.auth.authorized(owner), false);

      await assertRevert(this.auth.authorize(owner, { from: owner }), 'Owner cannot be authorized');
    });

    it('unless they are not authorized to authorize users', async function() {
      assert.equal(await this.auth.authorized(unauthorized), false);

      await assertRevert(this.auth.authorize(other, { from: unauthorized }));
    });
  });

  describe('deauthorizes users', () => {
    it('that are authorized', async function() {
      assert.equal(await this.auth.authorized(authorized), true);

      await this.auth.deauthorize(authorized, { from: owner });

      assert.equal(await this.auth.authorized(authorized), false);
    });

    it('unless they are already deauthorized', async function() {
      assert.equal(await this.auth.authorized(unauthorized), false);

      await assertRevert(this.auth.deauthorize(unauthorized, { from: owner }), 'Already unauthorized');
    });

    it('unless trying to deauthorize the owner', async function() {
      await assertRevert(this.auth.deauthorize(owner, { from: owner }), 'Owner cannot be deauthorized');
    });

    it('unless they are not the owner', async function() {
      await assertRevert(this.auth.deauthorize(authorized, { from: unauthorized }));
    });
  });
});
