interface Props {
  onNext: () => void;
  disabled: boolean;
}

function TurnControls({ onNext, disabled }: Props) {
  return (
    <div className="controls">
      <button onClick={onNext} disabled={disabled}>
        Llamar siguiente turno
      </button>
    </div>
  );
}

export default TurnControls;
