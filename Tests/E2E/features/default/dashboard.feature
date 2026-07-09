@default-context
Feature: What's new backend module

  As an editor I can find the "What's new" backend module and open its
  "In your project" submodule. Without a configured source url the submodule
  shows a hint instead of the news iframe.

  Background:
    Given A user with username "editor", password "password" and role "Neos.Neos:Editor" exists
    When I log in with username "editor" and password "password"
    Then I should see the Neos content page

  Scenario: The "What's new" menu entry is shown to editors
    When I close the New features dialog
    And I open the Neos menu
    Then I should see the "What's new" menu entry

  Scenario: The module overview shows the "In your project" tile
    When I open the What's new module overview
    Then I should see the "In your project" tile

  Scenario: The tile links to the "In your project" submodule
    When I open the What's new module overview
    And I click the "In your project" tile
    Then I should land on "/neos/whats-new/in-project"

  Scenario: The "In your project" module shows a hint when no source url is configured
    When I open the In your project module
    Then I should see the message "Source url was not set."
    And the news iframe should not be present
