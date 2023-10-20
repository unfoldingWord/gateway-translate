---
name: Release issue template
about: Steps to follow for Release process
title: ''
labels: ''
assignees: ''

---

# Release of gatewayTranslate v*.*

## Preconditions

- [ ] The develop branch has all changes merged for the next release
- [ ] The develop branch has the semver for the next release
- [ ] QA has signed off on the work (including tested against production)
- [ ] Release notes are prepared

## Tasks

- [ ] create a release branch from develop, named by the release semver: release-v*.*
- [ ] create [PR](https://github.com/unfoldingWord/gateway-translate/pull/167) to merge release branch into main and merge (**do not delete branch after merge**)
- [ ] tag develop: git tag v*.* && git push --tags
- [ ] cut a release from the release branch
- [ ] add to the release the notes and any assets
- [ ] announce on forum.door43.org
