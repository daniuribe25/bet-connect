defmodule PlConnect.Cod.UserCodProfile do
  @moduledoc """
  Embeded resource
  """
  use Ash.Resource,
    data_layer: :embedded

  attributes do
    attribute :json, :map

    attribute :kda_ratio, :float
  end
end
