defmodule PlConnect.Cod.Resource.Changes.User.NextStep do
  @moduledoc false
  use Ash.Resource.Change

  require Ash.Query

  def next_step(new_step) do
    {__MODULE__, [new_step: new_step]}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, opts, _) do
    step_register = Ash.Changeset.get_attribute(changeset, :step_register)
    prev_step = to_string(step_register)
      |> String.slice(5..6)
      |> Integer.parse()
      |> elem(0)
    next = opts[:new_step]
    post_step = to_string(next)
      |> String.slice(5..6)
      |> Integer.parse()
      |> elem(0)

    if post_step > prev_step do
      Ash.Changeset.force_change_attribute(changeset, :step_register, next)
    else
      changeset
    end
  end
end