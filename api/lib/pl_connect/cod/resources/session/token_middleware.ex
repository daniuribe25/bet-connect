defmodule PlConnect.Cod.Session.TokenMiddleware do
  @moduledoc """
  Update the context for absinthe so we could authenticate admins on the admin panel
  """
  def token_to_ctx(resolution, changeset, _mutation_result) do
    case Ash.Changeset.get_attribute(changeset, :is_admin) do
      true ->
        Map.update!(resolution, :context, fn ctx ->
          Map.put(ctx, :auth_token, Ash.Changeset.get_attribute(changeset, :token))
        end)

      _ ->
        resolution
    end
  end
end
