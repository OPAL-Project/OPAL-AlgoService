# -*- coding: utf-8 -*-
from opalalgorithms.core import OPALPrivacy


class Density(OPALPrivacy):

    def __init__(self):
        pass

    def __call__(self, result, params, salt):
        return result;
