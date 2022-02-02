defmodule PlConnect.Cod.Resource.Changes.Lowercase do
  @moduledoc """
  Ash change, validates that all items in the list are unique
  """
  use Ash.Resource.Change

  def lowercase(argument_or_attribute) do
    {__MODULE__, [argument: argument_or_attribute]}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, opts, _) do
    case Ash.Changeset.fetch_argument(changeset, opts[:argument]) do
      {:ok, value} ->
        Ash.Changeset.set_argument(changeset, opts[:argument], String.downcase(value))

      :error ->
        fetch_attribute(changeset, opts)
    end
  end

  defp fetch_attribute(changeset, opts) do
    case Ash.Changeset.get_attribute(changeset, opts[:argument]) do
      nil ->
        unique_error(changeset, opts)

      value ->
        Ash.Changeset.force_change_attribute(changeset, opts[:argument], String.downcase(value))
    end
  end

  defp unique_error(changeset, opts),
    do:
      Ash.Changeset.add_error(changeset,
        field: opts[:argument],
        message: "The given argument does not have a value"
      )
end
