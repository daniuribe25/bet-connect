defmodule PlConnect.Cod.Resource.Changes.UpdateInnerAttribute do
  @moduledoc """
  Ash change, updates specific field from inner attribute
  """
  use Ash.Resource.Change

  def update_inner_attribute(attribute, field, value, type) do
    {__MODULE__, [attribute: attribute, field: field, value: value, type: type]}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, opts, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      attribute = get_value(changeset, opts, :attribute)
      field = get_value(changeset, opts, :field)
      value = get_value(changeset, opts, :value)
      value = case get_value(changeset, opts, :type) do
        :float -> Float.parse(value) |> elem(0)
        :integer -> Integer.parse(value) |> elem(0)
        :boolean -> value == "true"
        _ -> value
      end

      attribute_modified = Ash.Changeset.get_attribute(changeset, attribute) |> Map.put(field, value)
      Ash.Changeset.force_change_attribute(changeset, attribute, attribute_modified)
    end)
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