# Code Modification Guidelines

## Adding New Features
- Ensure new code follows the existing architecture and patterns
- Add comprehensive tests for new functionality
- Document new features in appropriate documentation files
- Maintain backward compatibility with existing features
- Follow the established naming conventions and coding style

## Modifying Existing Code
- Do not delete functional code while adding new features
- Preserve existing functionality when refactoring
- Document the reason for significant changes
- Update tests to reflect changes in behavior
- Ensure modifications don't break existing features

## Removing Code
- Never remove code without understanding its purpose and dependencies
- Deprecate functionality before removing it completely
- Document removed code and the reason for removal
- Update or remove tests related to removed code
- Ensure removal doesn't break dependent features

## Refactoring
- Refactor incrementally to minimize risk
- Maintain the same behavior during refactoring
- Add tests before refactoring to ensure behavior is preserved
- Document architectural changes resulting from refactoring
- Review refactored code thoroughly before merging

## Code Review
- Review all code modifications for adherence to these guidelines
- Verify that functional code hasn't been deleted
- Check that new features integrate well with existing code
- Ensure tests cover both new and modified functionality
- Verify documentation has been updated appropriately 