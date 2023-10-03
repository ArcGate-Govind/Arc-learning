import * as cookies from 'js-cookie';
import {
  getUser,
  getToken,
  getaccessToken,
  removeUserSession,
  setUserSession,
} from '../../src/utils/common'; 

// Mock the 'js-cookie' library functions
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe('Cookie Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user data from Cookies', () => {
    // Mock the 'get' function from 'js-cookie'
    cookies.get.mockReturnValue(JSON.stringify({ username: 'testUser' }));

    const user = getUser();
    expect(user).toEqual({ username: 'testUser' });
    expect(cookies.get).toHaveBeenCalledWith('user');
  });

  it('should return null when no user data in Cookies', () => {
    
    cookies.get.mockReturnValue(null);

    const user = getUser();
    expect(user).toBeNull();
    expect(cookies.get).toHaveBeenCalledWith('user');
  });

  it('should get the refresh token from Cookies', () => {
   
    cookies.get.mockReturnValue('refreshToken123');

    const refreshToken = getToken();
    expect(refreshToken).toEqual('refreshToken123');
    expect(cookies.get).toHaveBeenCalledWith('refreshtoken');
  });

  it('should return null when no refresh token in Cookies', () => {

    cookies.get.mockReturnValue(null);

    const refreshToken = getToken();
    expect(refreshToken).toBeNull();
    expect(cookies.get).toHaveBeenCalledWith('refreshtoken');
  });

  it('should get the access token from Cookies', () => {

    cookies.get.mockReturnValue('accessToken456');

    const accessToken = getaccessToken();
    expect(accessToken).toEqual('accessToken456');
    expect(cookies.get).toHaveBeenCalledWith('accessToken');
  });

  it('should return null when no access token in Cookies', () => {

    cookies.get.mockReturnValue(null);

    const accessToken = getaccessToken();
    expect(accessToken).toBeNull();
    expect(cookies.get).toHaveBeenCalledWith('accessToken');
  });

  it('should remove user session from Cookies', () => {
    removeUserSession();

    // Verify that 'remove' function from 'js-cookie' is called for each cookie
    expect(cookies.remove).toHaveBeenCalledWith('refreshtoken');
    expect(cookies.remove).toHaveBeenCalledWith('user');
    expect(cookies.remove).toHaveBeenCalledWith('accessToken');
  });

  it('should set user session in Cookies', () => {
    const user = { username: 'testUser' };
    const refreshToken = 'refreshToken123';
    const accessToken = 'accessToken456';

    setUserSession(refreshToken, accessToken, user);

    // Verify that 'set' function from 'js-cookie' is called with the correct values
    expect(cookies.set).toHaveBeenCalledWith('user', JSON.stringify(user), expect.any(Object));
    expect(cookies.set).toHaveBeenCalledWith('accessToken', accessToken, expect.any(Object));
    expect(cookies.set).toHaveBeenCalledWith('refreshtoken', refreshToken, expect.any(Object));
  });
});
