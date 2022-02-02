defmodule PlConnect.MailClient do

  alias Bamboo.Email
  alias PlConnect.Mailer

  @password_template """
  Your temporary PL Connect password is %PASSWORD%, please login and change your password from the left side menu
  """

  @verification_code_template """
  Hi,
  <br><br>
  Enter this code to finishing signing up on your Players’ Lounge Connect: %CODE%
  <br><br>
  If you didn’t request this code, you can ignore this email.
  """

  def send_password_reset(email, new_pass) do
    body = String.replace(@password_template, "%PASSWORD%", new_pass)

    Email.new_email()
    |> Email.to(email)
    |> Email.from("notifications@playerslounge.co")
    |> Email.subject("Player's Lounge Connect password changes")
    |> Email.html_body(body)
    |> Mailer.deliver_now()
  end

  def send_verification_code(email, code) do
    subject = String.replace("%CODE% is your Player's Lounge Connect code", "%CODE%", code)
    body = String.replace(@verification_code_template, "%CODE%", code)

    Email.new_email()
    |> Email.from("notifications@playerslounge.co")
    |> Email.to(email)
    |> Email.subject(subject)
    |> Email.html_body(body)
    |> Mailer.deliver_now()
  end
end