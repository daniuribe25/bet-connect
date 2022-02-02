defmodule PlConnect.Cod.Resource.Changes.PushToAttribute do
  @moduledoc """
  Ash change, validates that all items in the list are unique
  """
  use Ash.Resource.Change

  def push_to_attribute(attribute, value) do
    {__MODULE__, [attribute: attribute, value: value]}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, opts, _) do
    case Ash.Changeset.get_attribute(changeset, opts[:attribute]) do
      list when is_list(list) ->
        case opts[:value] do
          {:arg, arg} ->
            case Ash.Changeset.fetch_argument(changeset, arg) do
              {:ok, value} ->
                Ash.Changeset.force_change_attribute(changeset, opts[:attribute], list ++ [value])

              _ ->
                value_error(changeset, opts)
            end

          _ ->
            value =
              case opts[:value] do
                value when is_function(value) -> value.()
                value -> value
              end

            Ash.Changeset.force_change_attribute(changeset, opts[:attribute], list ++ [value])
        end

      _ ->
        argument_error(changeset, opts)
    end
  end

  defp argument_error(changeset, opts),
    do:
      Ash.Changeset.add_error(changeset,
        field: opts[:argument],
        message: "is not an a compatible value or not exist"
      )

  defp value_error(changeset, opts),
    do:
      Ash.Changeset.add_error(changeset,
        field: opts[:value],
        message: "not found on the arguments"
      )
end
