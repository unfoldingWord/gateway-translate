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
[![Contributors][contributors-shield]](https://github.com/unfoldingWord/door43-preview-app/graphs/contributors)
[![Forks][forks-shield]](https://github.com/unfoldingWord/door43-preview-app/network/members)
[![Stargazers][stars-shield]](https://github.com/unfoldingWord/door43-preview-app/stargazers)
[![Issues][issues-shield]](https://github.com/unfoldingWord/door43-preview-app/issues)
[![MIT License][license-shield]](https://github.com/unfoldingWord/door43-preview-app/blob/main/LICENSE)
[![LinkedIn][linkedin-shield]](https://www.linkedin.com/company/unfoldingword/)



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://door43-preview-app.netlify.app/">
    <img src="images/uW.png" alt="Logo" width="300" height="50">
  </a>

<h3 align="center">Door43 Preview App</h3>

  <p align="center">
    This application is for viewing rendered resources from DCS
    <br />
    <a href="https://github.com/unfoldingword/door43-preview-app"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://door43-preview.netlify.app/">Go to Application</a>
    ·
    <a href="https://github.com/unfoldingword/door43-preview-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/unfoldingword/door43-preview-app/issues">Request Feature</a>
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

### Installation/First Steps

1. Get a [DCS](https://git.door43.org) account
2. Clone the repo
   ```sh
   git clone https://github.com/unfoldingword/door43-preview-app.git
   ```
3. Install NPM packages
   ```sh
   yarn install
   ```
3. Build the Next.js app
   ```sh
   yarn build
   ```
4. Start the local server 
   ```sh
   yarn dev
   ```
5. Visit <a href="http://localhost:3333">localhost:3333</a>  

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/unfoldingword/door43-preview-app/issues) for a full list of proposed features (and known issues).

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
`https://door43-preview.netlify.app/?server=qa`.  

This is a toggle and will stay pointed at QA until another setting is applied.

To point to production:
`https://door43-preview.netlify.app/?server=prod`

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

Project Link: [https://github.com/unfoldingword/door43-preview-app](https://github.com/unfoldingword/door43-preview-app)

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
[contributors-shield]: https://img.shields.io/github/contributors/unfoldingword/door43-preview-app.svg?style=for-the-badge
[contributors-url]: https://github.com/unfoldingword/door43-preview-app/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/unfoldingword/door43-preview-app.svg?style=for-the-badge
[forks-url]: https://github.com/unfoldingword/door43-preview-app/network/members
[stars-shield]: https://img.shields.io/github/stars/unfoldingword/door43-preview-app.svg?style=for-the-badge
[stars-url]: https://github.com/unfoldingword/door43-preview-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/unfoldingword/door43-preview-app.svg?style=for-the-badge
[issues-url]: https://github.com/unfoldingword/door43-preview-app/issues
[license-shield]: https://img.shields.io/github/license/unfoldingword/door43-preview-app.svg?style=for-the-badge
[license-url]: https://github.com/unfoldingword/door43-preview-app/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/company/unfoldingword

