import { isFSCommerceOfficialAppUrl } from "./isFSCommerceOfficialAppUrl";

const setCloudDomain = (value: string | undefined): void => {
  window.__SALEOR_CONFIG__ = { ...window.__SALEOR_CONFIG__, SALEOR_CLOUD_APP_DOMAIN: value };
};

describe("isFSCommerceOfficialAppUrl", () => {
  const originalConfig = window.__SALEOR_CONFIG__;

  afterEach(() => {
    window.__SALEOR_CONFIG__ = originalConfig;
  });

  it("returns false when cloud domain env var is not set", () => {
    // Arrange
    setCloudDomain(undefined);

    // Act
    const result = isFSCommerceOfficialAppUrl("https://app.saleor.app/widget");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when cloud domain env var is empty string", () => {
    // Arrange
    setCloudDomain("");

    // Act
    const result = isFSCommerceOfficialAppUrl("https://app.saleor.app/widget");

    // Assert
    expect(result).toBe(false);
  });

  it("returns true for URL hosted exactly on the cloud domain", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act
    const result = isFSCommerceOfficialAppUrl("https://saleor.app/widget");

    // Assert
    expect(result).toBe(true);
  });

  it("returns true for URL hosted on a subdomain of the cloud domain", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act
    const result = isFSCommerceOfficialAppUrl("https://my-app.saleor.app/widget");

    // Assert
    expect(result).toBe(true);
  });

  it("returns false for URL hosted outside the cloud domain", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act
    const result = isFSCommerceOfficialAppUrl("https://example.com/widget");

    // Assert
    expect(result).toBe(false);
  });

  it("does not match a domain that merely ends with the cloud domain string", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act - "evilsaleor.app" must not be treated as a subdomain of "saleor.app"
    const result = isFSCommerceOfficialAppUrl("https://evilsaleor.app/widget");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when URL cannot be parsed", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act
    const result = isFSCommerceOfficialAppUrl("not-a-url");

    // Assert
    expect(result).toBe(false);
  });
});
