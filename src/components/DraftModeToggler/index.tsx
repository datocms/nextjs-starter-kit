'use client';

type Props = {
  draftModeEnabled: boolean;
};

export default function DraftModeToggler({ draftModeEnabled }: Props) {
  async function handleClick() {
    let response: Response;

    if (draftModeEnabled) {
      response = await fetch('/api/draft-mode/disable');
    } else {
      const token = prompt(
        'To enter Draft Mode, you need to insert the SECRET_API_TOKEN:',
        'secretTokenProtectingWebhookEndpointsFromBeingCalledByAnyone',
      );
      if (!token) {
        return;
      }

      response = await fetch(`/api/draft-mode/enable?token=${token}`);
    }

    if (!response.ok) {
      alert('Could not complete the operation!');
      return;
    }

    document.location.reload();
  }

  if (draftModeEnabled) {
    return (
      <button type="button" onClick={handleClick}>
        Disable Draft Mode
      </button>
    );
  }

  return (
    <button type="button" onClick={handleClick}>
      Enable Draft Mode
    </button>
  );
}
