'use strict';

/**
 * Module dependencies.
 */

const ProxyTokenAuthorizableV0 = artifacts.require('ProxyTokenAuthorizableV0');
const assertRevert = require('../../helpers/assertRevert');

/**
 * `ProxyTokenAuthorizableV0` tests.
 */

contract('ProxyTokenAuthorizableV0', ([, owner, notOwner, user]) => {
  beforeEach(async function() {
    this.auth = await ProxyTokenAuthorizableV0.new(owner, { from: owner });
  });

  describe('Mint', () => {
    describe('authorizeMintRequester', () => {
      describe('when the caller is not the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.auth.authorizeMintRequester(user, { from: notOwner }));
        });
      });

      describe('when the caller is the owner', () => {
        describe('when the user is already authorized', () => {
          it('reverts', async function() {
            await this.auth.authorizeMintRequester(user, { from: owner });
            await assertRevert(this.auth.authorizeMintRequester(user, { from: owner }), 'User has mint request authorization');
          });
        });

        describe('when the user is the owner', () => {
          it('reverts', async function() {
            await assertRevert(this.auth.authorizeMintRequester(owner, { from: owner }), 'User cannot be the owner');
          });
        });

        describe('when the user is not authorized', () => {
          it('the user is authorized', async function() {
            await this.auth.authorizeMintRequester(user, { from: owner });

            const authorized = await this.auth.mintRequestAuthorization(user);

            assert.equal(authorized, true);
          });

          it('reverts when attempting to authorize as mint fulfiller', async function() {
            await this.auth.authorizeMintRequester(user, { from: owner });
            await assertRevert(this.auth.authorizeMintFulfiller(user, { from: owner }), 'User has mint request authorization');
          });
        });
      });
    });

    describe('deauthorizeMintRequester', () => {
      describe('when the caller is not the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.auth.deauthorizeMintRequester(user, { from: notOwner }));
        });
      });

      describe('when the caller is the owner', () => {
        describe('when the user is already deauthorized', () => {
          it('reverts', async function() {
            await assertRevert(this.auth.deauthorizeMintRequester(user, { from: owner }), 'User does not have mint request authorization');
          });
        });

        describe('when the user is authorized', () => {
          it('the user is deauthorized', async function() {
            await this.auth.authorizeMintRequester(user, { from: owner });
            await this.auth.deauthorizeMintRequester(user, { from: owner });

            const authorized = await this.auth.mintRequestAuthorization(user);

            assert.equal(authorized, false);
          });
        });
      });
    });

    describe('authorizeMintFulfiller', () => {
      describe('when the caller is not the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.auth.authorizeMintFulfiller(user, { from: notOwner }));
        });
      });

      describe('when the caller is the owner', () => {
        describe('when the user is already authorized', () => {
          it('reverts', async function() {
            await this.auth.authorizeMintFulfiller(user, { from: owner });
            await assertRevert(this.auth.authorizeMintFulfiller(user, { from: owner }), 'User has mint fulfill authorization');
          });
        });

        describe('when the user is not authorized', () => {
          it('the user is authorized', async function() {
            await this.auth.authorizeMintFulfiller(user, { from: owner });

            const authorized = await this.auth.mintFulfillAuthorization(user);

            assert.equal(authorized, true);
          });

          it('reverts when attempting to authorize as mint requester', async function() {
            await this.auth.authorizeMintFulfiller(user, { from: owner });
            await assertRevert(this.auth.authorizeMintRequester(user, { from: owner }), 'User has mint fulfill authorization');
          });
        });
      });
    });

    describe('deauthorizeMintFulfiller', () => {
      describe('when the caller is not the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.auth.deauthorizeMintFulfiller(user, { from: notOwner }));
        });
      });

      describe('when the caller is the owner', () => {
        describe('when the user is already deauthorized', () => {
          it('reverts', async function() {
            await assertRevert(this.auth.deauthorizeMintFulfiller(user, { from: owner }), 'User does not have mint fulfill authorization');
          });
        });

        describe('when the user is authorized', () => {
          it('the user is deauthorized', async function() {
            await this.auth.authorizeMintFulfiller(user, { from: owner });
            await this.auth.deauthorizeMintFulfiller(user, { from: owner });

            const authorized = await this.auth.mintRequestAuthorization(user);

            assert.equal(authorized, false);
          });
        });
      });
    });
  });

  describe('Burn', () => {
    describe('authorizeBurnRequester', () => {
      describe('when the caller is not the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.auth.authorizeBurnRequester(user, { from: notOwner }));
        });
      });

      describe('when the caller is the owner', () => {
        describe('when the user is already authorized', () => {
          it('reverts', async function() {
            await this.auth.authorizeBurnRequester(user, { from: owner });
            await assertRevert(this.auth.authorizeBurnRequester(user, { from: owner }), 'User has burn request authorization');
          });
        });

        describe('when the user is not authorized', () => {
          it('the user is authorized', async function() {
            await this.auth.authorizeBurnRequester(user, { from: owner });

            const authorized = await this.auth.burnRequestAuthorization(user);

            assert.equal(authorized, true);
          });

          it('reverts when attempting to authorize as burn fulfiller', async function() {
            await this.auth.authorizeBurnRequester(user, { from: owner });
            await assertRevert(this.auth.authorizeBurnFulfiller(user, { from: owner }), 'User has burn request authorization');
          });
        });
      });
    });

    describe('deauthorizeBurnRequester', () => {
      describe('when the caller is not the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.auth.deauthorizeBurnRequester(user, { from: notOwner }));
        });
      });

      describe('when the caller is the owner', () => {
        describe('when the user is already deauthorized', () => {
          it('reverts', async function() {
            await assertRevert(this.auth.deauthorizeBurnRequester(user, { from: owner }), 'User does not have burn request authorization');
          });
        });

        describe('when the user is authorized', () => {
          it('the user is deauthorized', async function() {
            await this.auth.authorizeBurnRequester(user, { from: owner });
            await this.auth.deauthorizeBurnRequester(user, { from: owner });

            const authorized = await this.auth.burnRequestAuthorization(user);

            assert.equal(authorized, false);
          });
        });
      });
    });

    describe('authorizeBurnFulfiller', () => {
      describe('when the caller is not the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.auth.authorizeBurnFulfiller(user, { from: notOwner }));
        });
      });

      describe('when the caller is the owner', () => {
        describe('when the user is already authorized', () => {
          it('reverts', async function() {
            await this.auth.authorizeBurnFulfiller(user, { from: owner });
            await assertRevert(this.auth.authorizeBurnFulfiller(user, { from: owner }), 'User has burn fulfill authorization');
          });
        });

        describe('when the user is not authorized', () => {
          it('the user is authorized', async function() {
            await this.auth.authorizeBurnFulfiller(user, { from: owner });

            const authorized = await this.auth.burnFulfillAuthorization(user);

            assert.equal(authorized, true);
          });

          it('reverts when attempting to authorize as burn requester', async function() {
            await this.auth.authorizeBurnFulfiller(user, { from: owner });
            await assertRevert(this.auth.authorizeBurnRequester(user, { from: owner }), 'User has burn fulfill authorization');
          });
        });
      });
    });

    describe('deauthorizeBurnFulfiller', () => {
      describe('when the caller is not the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.auth.deauthorizeBurnFulfiller(user, { from: notOwner }));
        });
      });

      describe('when the caller is the owner', () => {
        describe('when the user is already deauthorized', () => {
          it('reverts', async function() {
            await assertRevert(this.auth.deauthorizeBurnFulfiller(user, { from: owner }), 'Only authorized burn fulfiller');
          });
        });

        describe('when the user is authorized', () => {
          it('the user is deauthorized', async function() {
            await this.auth.authorizeBurnFulfiller(user, { from: owner });
            await this.auth.deauthorizeBurnFulfiller(user, { from: owner });

            const authorized = await this.auth.burnFulfillAuthorization(user);

            assert.equal(authorized, false);
          });
        });
      });
    });
  });
});
