# Contribution Guidelines

The following is a set of guidelines for best practices when contributing. 

## Getting Started

If you would like to contribute to this project, start by setting up a local development environment. Instructions for setting this up can be found LINK HERE.

The priorities for development are found LINK HERE. This list is not comprehensive, and will be changed over time.

## Features

All features in development will have an active Github Issue, which will be marked with the `feature` tag. If you are working on a feature, 
comment in the issue thread so others do not repeat the same work you are doing. Features in development should have their own branch that 
follows the naming convention `feature/<feature-name>`. When a feature is complete, make a pull request tagging the issue in it. 

If you would like to see a feature developed, compose an issue for that feature so it can be discussed and developed. The following template can be used to 
ensure the appropriate information is included.

```
  Give a description of the desired feature:
  
  How will this feature improve this product?
  
  What parts of the current design will this feature affect?

  If appropriate, include an image of the proposed design for this feature:
  
  Additional Information: (If there has been discussion about this feature elsewhere, link it here)
```

## Bugs

All known bugs should be documented as a Github Issue with the `bug` tag. If you are working on a bug fix, comment on the issue thread so others do not repeat 
the same work you are doing. Bug fixes in development should have their own branch that follows the naming convention `bug-fix/<bug-name>`. When a bug fix is 
complete, make a pull request tagging the issue in it.

If you find a bug, check the issues to see if it has been documented yet. If it is not documented, open an issue on it, using the following template:

```
  What is the bugged behavior?

  What is the intended behavior?
  
  Can this bug be replicated?
  
  Is the cause of the bug known?
  
  If appropriate, include a screenshot of the bug.
  
  Additional Information: (If there has been discussion about this feature elsewhere, link it here)
```

## Pull Requests

A pull request should be made whenever a branch completes the development of a feature or bug fix. A pull request should link the related issue and any other 
discussion about the issue. If there is anything about the development that diverged from what has been discussed in the issue, note it here. Once a pull 
request has been made, it must be reviewed by at least one other developer before being merged into `main`. 

## Code Reviews

All pull requests must be reviewed by another contributor before it is elegible to be merged. The purpose of code reviews are to ensure quality throughout the project.
Once a review has been completed and code has been approved, the pull request will be merged by the owner. The specifics of the code review are at the discression of 
the reviewer, but below are things to consider while reviewing code:

* __Design__ -- Does the overall structure make sense for the bigger picture of the project? Is it consistent with the current features?
Are the individual piece of the the code clean and condusive to future development and expansion?
* __Functionality__ -- Does the code solve the problem described in the issue? Is there an efficiency loss with the implementation of this code?
If so, does the contribution justify the loss? Are there edge cases that will break the new code?
* __Complexity__ -- Is the code more complex than it needs to be? Is the code readable to developers who have not used it before? Are any individual files too long, 
and should be broken into multiple smaller files? Are future developers likely to introduce bugs into this code because of its complexity?
* __Tests__ -- Does this code pass all existing tests? Does this code introduce the need for new tests? If so, have those been written?
* __Comments__ -- Are the comments clear and concise? Are there any unnecessary comments? Are there places that should have comments but don't?
* __Style__ -- Is this style consistent with existing code?
* __Documentation__ -- Were any changes made that require existing documentation to be changed? Has that documentation been changed?
