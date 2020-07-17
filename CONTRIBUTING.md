# COVID Green is an OPEN Open Source Project

## What?

Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit at the discretion of the Lead Maintainers.

## Rules

There are a few basic ground-rules for contributors:

1. **No `--force` pushes** on `master` or modifying the Git history in any way after a PR has been merged.
1. **Non-master branches** ought to be used for ongoing work.
1. **External API changes and significant modifications** ought to be subject to an **internal pull-request** to solicit feedback from other contributors.
1. Internal pull-requests to solicit feedback are *encouraged* for any other non-trivial contribution but left to the discretion of the contributor.
1. Contributors should attempt to adhere to the prevailing code-style.
1. At least two contributors, or one core member, must approve pull-requests prior to merging.
1. All integrated CI services must be green before a pull-request can be merged.
1. SemVer-major changes in this repository must be merged by a lead maintainer.
1. In case it is not possible to reach consensus in a pull-request, the decision is left to the lead maintainers team.

## Releases

Declaring formal releases remains the prerogative of the Lead Maintainers. Do not bump version numbers in pull requests.

## Changes to this arrangement

This document may also be subject to pull-requests or changes by contributors where you believe you have something valuable to add or change.

# Organization Structure

We have many collaborators, and every kind of contribution is welcome! Our organization is structured as follows:

|  Team | Responsibility  |  Repository |
|---|---|---|
| `@covidgreen/leads` | Lead Maintainers | GitHub organization owners |
| `@covidgreen/core`  |  Core development  |  `covid-green-app` `react-native-exposure-notification-service`|

Every memeber of the org is also part of `@covidgreen/members`.

### Onboarding Collaborators

Welcome to the team! We are happy to have you. Before you start, please complete the following tasks:
1. Set up 2 factor authentication for GitHub and NPM
  - [GitHub 2FA](https://help.github.com/en/articles/securing-your-account-with-two-factor-authentication-2fa)
  - [NPM 2FA](https://docs.npmjs.com/about-two-factor-authentication)
2. Choose which team to join *(more than one is ok!)* based on how you want to help.
3. Open a pull request to [`covidgreen/covid-green-app:current`](https://github.com/covidgreen/covid-green-app/pulls) that adds your name, username, and email to the team you have choosen in the [README.md](./README.md). The members lists are sorted alphabetically; make sure to add your name in the proper order.

### Offboarding Collaborators

We are thankful to you and we are really glad to have worked with you.
We'll be really happy to see you here again if you want to come back, but for now the person that did the onboarding must:
1. Ask the collaborator if they want to stay or not.
1. If the collaborator can't work with us anymore, they should:
  1. Open a pull request to [`covidgreen/covid-green-app:current`](https://github.com/covidgreen/covid-green-app/pulls) and move themselves in the *Past Collaborators* section.

The person that did the onboarding must:
1. If the collaborator doesn't reply to the ping in reasonable time, open the pull requests described above.
2. Remove the collaborator from the teams on GitHub.
-----------------------------------------

<a id="developers-certificate-of-origin"></a>
## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I
  have the right to submit it under the open source license
  indicated in the file; or

* (b) The contribution is based upon previous work that, to the best
  of my knowledge, is covered under an appropriate open source
  license and I have the right under that license to submit that
  work with modifications, whether created in whole or in part
  by me, under the same open source license (unless I am
  permitted to submit under a different license), as indicated
  in the file; or

* (c) The contribution was provided directly to me by some other
  person who certified (a), (b) or (c) and I have not modified
  it.

* (d) I understand and agree that this project and the contribution
  are public and that a record of the contribution (including all
  personal information I submit with it, including my sign-off) is
  maintained indefinitely and may be redistributed consistent with
  this project or the open source license(s) involved.
