import { eslintConfigReact } from './eslint-config-react';

describe('eslintConfigReact', () => {
  it('should work', () => {
    expect(eslintConfigReact()).toEqual('eslint-config-react');
  });
});
