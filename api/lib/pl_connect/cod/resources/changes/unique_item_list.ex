defmodule PlConnect.Cod.Resource.Changes.UniqueItemList do
  @moduledoc """
  Ash change, validates that all items in the list are unique
  """
  use Ash.Resource.Change

  def unique_item_list(argument, selector \\ nil) do
    {__MODULE__, [argument: argument, selector: selector]}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, opts, _) do
    case Ash.Changeset.fetch_argument(changeset, opts[:argument]) do
      {:ok, value} ->
        selector = opts[:selector]

        value =
          case selector do
            nil ->
              value

            _ ->
              Enum.map(value, &Map.get(&1, selector))
          end

        set = value |> MapSet.new() |> Enum.to_list()

        if length(set) == length(value) do
          changeset
        else
          unique_error(changeset, opts)
        end

      :error ->
        unique_error(changeset, opts)
    end
  end

  defp unique_error(changeset, opts),
    do:
      Ash.Changeset.add_error(changeset,
        field: opts[:argument],
        message: "The given list has replicated entries"
      )
end
