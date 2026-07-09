@notification-modal
Feature: "New features" notification dialog

  The BackendModal UI plugin shows a "New features" dialog in the Neos UI.
  It appears whenever the `whatsNewNoteClosedTimestamp` cookie is missing, or
  older than the `clientNotificationTimestamp` served by
  /api/whats-new/in-project (provided by the companion package
  flowpack/neos-whatsneweditor-inmyproject, read from the newest published
  "What's New Dashboard Page" document).

  Background:
    Given A user with username "editor", password "password" and role "Neos.Neos:Editor" exists
    When I log in with username "editor" and password "password"
    Then I should see the Neos content page

  Scenario: The dialog appears on first backend visit and stays away after dismissal
    Then the New features dialog should be visible
    When I close the New features dialog
    Then the New features dialog should not be visible
    And the "whatsNewNoteClosedTimestamp" cookie should be set
    When I reload the page
    Then the New features dialog should not be visible

  Scenario: The dialog links to the "In your project" module
    Then the New features dialog should be visible
    When I follow the "Go to 'Whats new in your project'" link in the dialog
    Then I should land on "/neos/whats-new/in-project"

  Scenario: The dialog reappears when news are published after dismissal
    When I close the New features dialog
    Then the New features dialog should not be visible
    When a What's New Dashboard Page with a future notification date is published
    And I reload the page
    Then the New features dialog should be visible
