<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]](https://github.com/unfoldingWord/gateway-translate/graphs/contributors)
[![Forks][forks-shield]](https://github.com/unfoldingWord/gateway-translate/network/members)
[![Stargazers][stars-shield]](https://github.com/unfoldingWord/gateway-translate/stargazers)
[![Issues][issues-shield]](https://github.com/unfoldingWord/gateway-translate/issues)
[![MIT License][license-shield]](https://github.com/unfoldingWord/gateway-translate/blob/main/LICENSE)
[![LinkedIn][linkedin-shield]](https://www.linkedin.com/company/unfoldingword/)



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://gateway-translate.netlify.app/">
    <img src="images/uW.png" alt="Logo" width="300" height="50">
  </a>

<h3 align="center">gatewaytranslate</h3>

  <p align="center">
    This application is for use by Gateway Language translators.
    <br />
    <a href="https://github.com/unfoldingword/gateway-translate"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://gateway-translate.netlify.app/">Go to Application</a>
    ·
    <a href="https://github.com/unfoldingword/gateway-translate/issues">Report Bug</a>
    ·
    <a href="https://github.com/unfoldingword/gateway-translate/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
**Login Page**
![Login](./images/login.png)

**Setup Account**
![Setup Account](./images/setup_account.png)

**View Texts**
![view_resources](./images/view_resources.png)

**Purpose**
To provide a tool for Translation Teams to edit and translate Scripture Texts, which are typically in [USFM format](https://ubsicap.github.io/usfm/).

**Problem**
There are few (if any) web based editors for USFM markup, especially focused on translation activities.

**Scope**
- Current scope is focused on editing USFM text and doing alignments with the original language texts.
- It is envisioned that this tool also:
  - Enable translation of Bibilical Resources (translation notes, questions, etc.)
  - Supersede the existing tooling in unfoldingWord&#174; for translation tasks

**Background**
This project uses components from the Open Components Ecosystem (OCE) extensively. In particular it relies on Proskomma, a scripture runtime engine for the editor component itself. The latter is also contributed to the OCE community and we welcome others to reuse it.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [Next.js](https://nextjs.org/)
* [React.js](https://reactjs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

**Data**
- Must have an account on [DCS](https://git.door43.org)
- The source must be cloned from its repository (see above)
- `yarn install` is used to resolve/install dependencies
- `yarn dev` is used to start the local server listening on `localhost:3000`


### Installation/First Steps

1. Get a DCS account
2. Clone the repo
   ```sh
   git clone https://github.com/unfoldingword/gateway-translate.git
   ```
3. Install NPM packages
   ```sh
   yarn install
   ```
4. Enter your API KEY in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES (for RCLs only)
## Usage/Integration

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_  Possibly JS Docs. 

[Styleguidist link](https://example.netlify.app) 

<p align="right">(<a href="#top">back to top</a>)</p>

-->

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/unfoldingword/gateway-translate/issues) for a full list of proposed features (and known issues).

This project uses Zenhub to manage the roadmap.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.  [Guidelines for external contributions.](https://forum.door43.org)

You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

If you would like to fork the repo and create a pull request. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Finally, you can point the application to either the QA or Production servers this way:

To use QA add the "server=qa" parameter to the URL:
`https://gateway-edit.netlify.app/?server=qa`.  

This is a toggle and will stay pointed at QA until another setting is applied.

To point to production:
`https://gateway-edit.netlify.app/?server=prod`

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Cecil New 
- Twitter [@mandolyte](https://twitter.com/@mandolyte)
- Discord [Cecil#5551](tbd)

Project Link: [https://github.com/unfoldingword/gateway-translate](https://github.com/unfoldingword/gateway-translate)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS 
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p>

-->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/unfoldingword/gateway-translate.svg?style=for-the-badge
[contributors-url]: https://github.com/unfoldingword/gateway-translate/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/unfoldingword/gateway-translate.svg?style=for-the-badge
[forks-url]: https://github.com/unfoldingword/gateway-translate/network/members
[stars-shield]: https://img.shields.io/github/stars/unfoldingword/gateway-translate.svg?style=for-the-badge
[stars-url]: https://github.com/unfoldingword/gateway-translate/stargazers
[issues-shield]: https://img.shields.io/github/issues/unfoldingword/gateway-translate.svg?style=for-the-badge
[issues-url]: https://github.com/unfoldingword/gateway-translate/issues
[license-shield]: https://img.shields.io/github/license/unfoldingword/gateway-translate.svg?style=for-the-badge
[license-url]: https://github.com/unfoldingword/gateway-translate/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/company/unfoldingword

