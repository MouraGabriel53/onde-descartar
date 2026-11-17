require "test_helper"

class ContactTest < ActiveSupport::TestCase
  def build_contact(kind, value)
    Contact.new(place: places(:bem_te_vi), kind: kind, value: value)
  end

  test "phone is normalized and displayed formatted" do
    contact = build_contact("phone", "(11) 3333-4444")
    assert contact.valid?, contact.errors.full_messages.inspect
    assert_equal "+551133334444", contact.value
    assert_equal "(11) 3333-4444", contact.display_value
    assert_equal "tel:+551133334444", contact.href
  end

  test "mobile phone is displayed with 5 digits prefix" do
    contact = build_contact("whatsapp", "11 98765-4321")
    assert contact.valid?
    assert_equal "(11) 98765-4321", contact.display_value
    assert_equal "https://wa.me/5511987654321", contact.href
  end

  test "whatsapp with landline is invalid" do
    assert_not build_contact("whatsapp", "(11) 3333-4444").valid?
  end

  test "email is stripped and downcased" do
    contact = build_contact("email", " A@B.COM ")
    assert contact.valid?
    assert_equal "a@b.com", contact.value
    assert_equal "mailto:a@b.com", contact.href
  end

  test "website without scheme gets https" do
    contact = build_contact("website", "exemplo.org")
    assert contact.valid?
    assert_equal "https://exemplo.org", contact.value
    assert_equal "exemplo.org", contact.display_value
  end

  test "website with ftp scheme is invalid" do
    assert_not build_contact("website", "ftp://x").valid?
  end

  test "duplicate contact on the same place is invalid" do
    contact = build_contact("phone", "(11) 0000-0101")
    assert_not contact.valid?
    assert contact.errors.key?(:value)
  end

  test "invalid kind is rejected" do
    assert_not build_contact("fax", "123").valid?
  end
end
