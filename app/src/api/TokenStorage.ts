/* eslint-disable @typescript-eslint/no-unused-vars */
 
 
﻿import EncryptedStorage from 'react-native-encrypted-storage';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export class TokenStorage {
  static async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      await EncryptedStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (_error) {
      console.error('Secure storage error:', _error);
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (_error) {
      return null;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (_error) {
      return null;
    }
  }

  static async clearTokens(): Promise<void> {
    try {
      await EncryptedStorage.removeItem(ACCESS_TOKEN_KEY);
      await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (_error) {
      console.error('Secure storage clear error:', _error);
    }
  }
}
