defmodule PlConnect.Cod.Resource.Changes.User.UpdateDifficulty do
  use Ash.Resource.Change
  use Ecto.Schema

  def update_difficulty(line, key, value) do
    {__MODULE__, [line: line, key: key, value: value]}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, opts, _) do
    difficulty = Ash.Changeset.get_attribute(changeset, :difficulty)
    line = get_value(changeset, opts, :line)
    key = get_value(changeset, opts, :key)
    value = get_value(changeset, opts, :value)

    difficulty = Map.get(difficulty, line)
      |> Map.put(key, value)
      |> (&Map.put(difficulty, line, &1)).()

    Ash.Changeset.change_attribute(changeset, :difficulty, difficulty)
  end

  def get_value(changeset, opts, field) do
    case opts[field] do
      {:arg, arg} ->
        case Ash.Changeset.fetch_argument(changeset, arg) do
          {:ok, value} -> value
          _ -> nil
        end
      _ ->
        case opts[field] do
          value when is_function(value) -> value.()
          value -> value
        end
    end
  end
end