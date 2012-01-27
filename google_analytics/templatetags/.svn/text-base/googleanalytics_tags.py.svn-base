from django import template
from django.conf import settings


register = template.Library()


def googleanalytics(tracking_code=None):
    """
    Includes the google analytics tracking code, using the code number in
    GOOGLE_ANALYTICS_ACCOUNT_CODE setting or the tag's param if given.
    
    Syntax::
    
        {% googleanalytics [code_number] %}
    
    Example::
    
        {% googleanalytics %}

        or if you want to override account code the code:

        {% googleanalytics "UA-000000-0" %}

    """
    if tracking_code is None:
        tracking_code = getattr(settings, 'GOOGLE_ANALYTICS_ACCOUNT_CODE', None)
    use_legacy_code = getattr(settings, 'GOOGLE_ANALYTICS_LEGACY_CODE', False)
    return {'tracking_code': tracking_code, 'use_legacy_code': use_legacy_code}
register.inclusion_tag('google_analytics/tracking_code.html')(googleanalytics)
