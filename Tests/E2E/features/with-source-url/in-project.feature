@with-source-url
Feature: In your project module with a configured source url

  With `inProjectSourceUrl` set (to the demo site homepage of this SUT), the
  "In your project" submodule embeds the configured page in an iframe.

  Background:
    Given A user with username "editor", password "password" and role "Neos.Neos:Editor" exists
    When I log in with username "editor" and password "password"
    Then I should see the Neos content page

  Scenario: The news iframe renders the configured source url
    When I open the In your project module
    Then the news iframe should be visible
    And the news iframe should point to "http://localhost:8081/"
    And the news iframe should show content
    And I should not see the message "Source url was not set."
