# Neos.WhatsNewDashboard
The WhatsNewDashboard is a backend module that adds different news-pages to Neos CMS.
Target audience are editors that work with Neos but do not have a technical background.

The first implemented use case is a news stream about the website they are currently editing. The dev team will be able to maintain a neos document that communicates via text and images what has changed within the project, e.g. new fields in the inspector. 
To do this, you will need to install a second package: [Neos.WhatsNewEditor.InMyProject](https://github.com/sandstorm/Neos.WhatsNewEditor.InMyProject) that contains nodetypes for said news page, its content and css styles.

Further use cases could be an editor-centered changelog (what has changed in the UI between my last neos version to the current one?) or announcements about new Neos Versions by the Neos Core team.

## Integration

### Installation

As long as it is not published on packagist:
* add github repo to your repositories in your `composer.json`:
```json
"repositories": {
    ...
    "neos-whatsnewdashboard": {
        "type": "vcs",
        "url": "https://github.com/sandstorm/Neos.WhatsNewDashboard"
    },
    ...
},
```
* require package in your `composer.json` with `composer require flowpack/neos-whatsnewdashboard:@dev`, which should result in:
```json
"require": {
    ...,
    "flowpack/neos-whatsnewdashboard": "@dev",
    ...
}
```

After publishing on packagist:
* install via composer with `composer require flowpack/neos-whatsnewdashboard`

### Usage

We assume you have either a neos instance which contains a news page created by the [Neos.WhatsNewEditor.InMyProject](https://github.com/sandstorm/Neos.WhatsNewEditor.InMyProject) package or such a a news page in your own instance. To show those news for your project add the `inProjectSourceUrl` to your `Settings.yaml` like this:

```yaml
Flowpack:
  Neos:
    WhatsNewDashboard:
      inProjectSourceUrl: 'https://my-page.de/whats-new' # example url
```

### Flowpack.ContentSecurityPolicy package

When you have the `Flowpack.ContentSecurityPolicy` installed and your source neos instance is not your project, then you have to add the source origin in your `ContentSecurityPolicy` config:

```yaml
Flowpack:
  ContentSecurityPolicy:
    content-security-policy:
      custom-backend:
        frame-src:
          - 'https://my-page.de/'
```

