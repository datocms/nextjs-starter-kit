'use client';

type Props = {
  draftModeEnabled: boolean;
  demoPassword?: string;
};

export default function DraftModeToggler({ draftModeEnabled, demoPassword }: Props) {
  async function handleClick() {
    let response: Response;

    if (draftModeEnabled) {
      response = await fetch('/api/draft-mode/disable');
    } else {
      const token = prompt(
        'To enter Draft Mode, you need to insert the SECRET_API_TOKEN:',
        demoPassword,
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
      <button
        type="button"
        onClick={handleClick}
        data-tooltip="Return to viewing published content"
      >
        Disable Draft Mode
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      data-tooltip="Preview unpublished changes from DatoCMS"
    >
      Enable Draft Mode
    </button>
  );
}
