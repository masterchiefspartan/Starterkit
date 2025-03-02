# Dependency Management Guidelines

## Package Selection
- Avoid deprecated npm packages (discard anything not updated in the last two years)
- Choose packages with active maintenance and community support
- Prefer packages with TypeScript support and type definitions
- Select packages with minimal dependencies to reduce bundle size
- Consider package size and performance impact before adding

## Version Management
- Lock dependency versions in package.json to ensure consistent builds
- Use semantic versioning (SemVer) for version specifications
- Regularly update dependencies to get security fixes and improvements
- Run comprehensive tests after dependency updates

## Security
- Regularly run security audits with `npm audit`
- Address critical and high severity vulnerabilities immediately
- Monitor dependencies for security advisories
- Avoid packages with known security issues

## Code Preservation
- Do not delete functional code while adding new features
- When refactoring, ensure all existing functionality is preserved
- Document any changes to dependencies that might affect existing code
- Maintain backward compatibility when updating dependencies

## Documentation
- Document all third-party dependencies in project documentation
- Include the purpose of each dependency in comments or documentation
- Document any custom configurations or usage patterns
- Keep track of dependency licenses for compliance

## Performance
- Monitor the impact of dependencies on bundle size
- Consider tree-shaking support when selecting packages
- Evaluate startup time impact for critical dependencies
- Use performance profiling to identify dependency bottlenecks 