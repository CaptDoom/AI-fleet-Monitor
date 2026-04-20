# Security Specification - AI Fleet Manager

## Data Invariants
1. A user can only read and write their own profile in `/users/{userId}`.
2. API Keys in `/api_keys/{keyId}` can only be read/updated/deleted by their `ownerId`.
3. Teams can only be modified by the `adminId`.
4. Global quotas are read-only for users, but admins can manage them.

## The "Dirty Dozen" Payloads (Test Cases)
1. **Identity Spoofing**: Attempt to create a user profile with a different UID than `auth.uid`.
2. **Key Hijacking**: User A attempts to read API Key belonging to User B.
3. **Privilege Escalation**: Attempt to update `role` to 'admin' via client SDK.
4. **Shadow Field Injection**: Attempt to create a Key document with an extra `isVerified: true` field.
5. **ID Poisoning**: Attempt to use a 2MB string as a `teamId`.
6. **Relational Sync Break**: Attempt to create a Team without being the admin or having a valid admin UID.
7. **Budget Bypass**: Standard user attempting to update the `budgetTokens` of a Team.
8. **Malicious Quota Update**: Attempt to reset `usedQuota` in global `/quotas`.
9. **Email Spoofing**: User with unverified email attempting to access administrative areas.
10. **Type Mismatch**: Attempt to update `budgetTokens` with a string instead of an integer.
11. **Negative Budget**: Attempt to set `budgetTokens` to a negative value.
12. **orphaned Key**: Attempt to create a Key pointing to a non-existent provider.

## Test Runner (firestore.rules.test.ts)
(Implementation of these tests in a test environment)
